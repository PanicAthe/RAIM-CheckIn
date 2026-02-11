import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as faceapi from 'face-api.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import logoImg from './assets/logo.png';
import { useIsMobile } from './hooks/useIsMobile';
import { RAIM_COLORS, DEFAULT_AGE_GROUPS, AGE_GROUP_ID_TO_LABEL, GENDER_MAP, SOURCE_MAP } from './constants';
import { convertToGroup } from './utils/ageConverter';
import { generateUniqueId } from './utils/idGenerator';
import { db } from './firebase';
import SuccessModal from './components/modals/SuccessModal';
import ErrorModal from './components/modals/ErrorModal';
import AdminLockScreen from './components/AdminLockScreen';
import ManualEntryCard from './components/ManualEntryCard';
import CameraCard from './components/CameraCard';
import VisitorList from './components/VisitorList';
import Dashboard from './components/Dashboard';
import ScanConfirmModal from './components/modals/ScanConfirmModal';
import SubmitConfirmModal from './components/modals/SubmitConfirmModal';
import LanguageToggle from './components/LanguageToggle';

function App() {
  const { t } = useTranslation();
  const [isAdminLocked, setIsAdminLocked] = useState(false);
  const [showRoomSetup, setShowRoomSetup] = useState(false);

  const videoRef = useRef();
  const canvasRef = useRef(null);
  const canvasCtxRef = useRef(null);
  const scanDebounceRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [visitors, setVisitors] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastCount, setLastCount] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showScanConfirm, setShowScanConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [scannedVisitors, setScannedVisitors] = useState([]);

  const [manualGender, setManualGender] = useState('male');
  const [manualGroup, setManualGroup] = useState('toddler');
  const [isAIMode, setIsAIMode] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const logoClickTimeoutRef = useRef(null);

  const { isMobile, isTablet, device } = useIsMobile();
  const styles = useMemo(() => getStyles(device), [device]);

  useEffect(() => {
    // 과거 날짜 데이터 삭제 (정규표현식으로 최적화)
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // ISO 형식: YYYY-MM-DD
    const keys = Object.keys(localStorage);
    const dataKeyRegex = /^(visitorCount|todayVisitors)_/;
    
    keys.filter(key => dataKeyRegex.test(key)).forEach(key => {
      const dateStr = key.split('_').slice(1).join('_');
      
      if (dateStr !== todayStr) {
        localStorage.removeItem(key);
      }
    });
    
    const roomLocation = localStorage.getItem('room_location');
    if (!roomLocation) {
      setShowRoomSetup(true);
    }
  }, []);

  const handleRoomSetupComplete = () => {
    setShowRoomSetup(false);
  };

  useEffect(() => {
    if (isAdminLocked || showRoomSetup) return;

    const loadModels = async () => {
      const MODEL_URL = '/models';
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
          faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
        ]);
        
        await warmupModel();
        setIsModelLoaded(true);
        if (!showDashboard) {
          startVideo();
        }
      } catch (e) {
        console.error("모델 로딩 실패:", e);
      }
    };
    loadModels();
  }, [isAdminLocked, showRoomSetup, showDashboard]);

  const startVideo = useCallback(() => {
    navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'user',
        width: { ideal: 720, max: 960 },
        height: { ideal: 540, max: 720 }
      } 
    })
      .then((stream) => { 
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("카메라 에러:", err));
  }, []);

  const stopVideo = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (showDashboard || isAdminLocked || showRoomSetup) {
      stopVideo();
    } else if (isModelLoaded && isAIMode) {
      startVideo();
    }
  }, [showDashboard, isModelLoaded, isAIMode, isAdminLocked, showRoomSetup, startVideo, stopVideo]);

  useEffect(() => {
    return () => {
      stopVideo();
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        canvasRef.current.width = 0;
        canvasRef.current.height = 0;
      }
      canvasCtxRef.current = null;
      canvasRef.current = null;
      if (scanDebounceRef.current) {
        clearTimeout(scanDebounceRef.current);
      }
      if (logoClickTimeoutRef.current) {
        clearTimeout(logoClickTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopVideo();
      } else if (!showDashboard && !isAdminLocked && !showRoomSetup && isModelLoaded && isAIMode) {
        startVideo();
      }
    };

    const handlePageHide = () => {
      stopVideo();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, []);

  const warmupModel = async () => {
    try {
      const dummyCanvas = document.createElement('canvas');
      dummyCanvas.width = 128;
      dummyCanvas.height = 128;
      const ctx = dummyCanvas.getContext('2d');
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 128, 128);
      
      await faceapi.detectSingleFace(
        dummyCanvas,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 608, scoreThreshold: 0.5 })
      ).withFaceLandmarks(true).withAgeAndGender();
      
      dummyCanvas.width = 0;
      dummyCanvas.height = 0;
    } catch (e) {
      // Warmup failure is non-critical
    }
  };

  const handleLogoClick = () => {
    const newClickCount = logoClickCount + 1;
    setLogoClickCount(newClickCount);

    if (logoClickTimeoutRef.current) {
      clearTimeout(logoClickTimeoutRef.current);
    }

    if (newClickCount === 3) {
      setShowDashboard(true);
      setLogoClickCount(0);
    } else {
      logoClickTimeoutRef.current = setTimeout(() => {
        setLogoClickCount(0);
      }, 3000);
    }
  };


  const scanFaces = useCallback(async () => {
    if (!videoRef.current || !isModelLoaded || isScanning || scanDebounceRef.current) return;
    
    setIsScanning(true);

    let canvas = null;
    
    try {
      const savedCorrection = localStorage.getItem('ageCorrection');
      const ageCorrection = savedCorrection ? parseInt(savedCorrection, 10) : 4;

      const maxDimension = 608;  // 416→608: 나이 정확도 향상 (약 0.5~0.8초 추가)
      const video = videoRef.current;
      if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
        setErrorMessage('카메라 준비 중입니다.\n잠시 후 다시 시도해주세요.');
        setShowErrorModal(true);
        return;
      }
      const scale = Math.min(maxDimension / video.videoWidth, maxDimension / video.videoHeight);
      const width = Math.floor(video.videoWidth * scale);
      const height = Math.floor(video.videoHeight * scale);

      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }
      canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      
      let ctx = canvasCtxRef.current;
      if (!ctx) {
        ctx = canvas.getContext('2d', { 
          willReadFrequently: true,
          alpha: false
        });
        canvasCtxRef.current = ctx;
      }
      ctx.drawImage(video, 0, 0, width, height);

      const detections = await faceapi.detectAllFaces(
        canvas,
        new faceapi.TinyFaceDetectorOptions({ 
          inputSize: 608,  // 416→608: 더 높은 해상도로 나이/성별 정확도 향상
          scoreThreshold: 0.5
        })
      )
        .withFaceLandmarks(true)
        .withAgeAndGender();

      if (detections.length === 0) {
        setErrorMessage('얼굴을 찾을 수 없습니다.\n카메라 각도와 조명을 확인해주세요.');
        setShowErrorModal(true);
      } else {
        // 뒷사람 필터링: 얼굴 크기가 일정 이상인 사람만 (앞쪽 사람)
        const minFaceSize = Math.min(width, height) * 0.12; // 화면 크기의 12% 이상
        const filteredDetections = detections.filter(d => {
          const box = d.detection.box;
          const faceSize = Math.min(box.width, box.height);
          return faceSize >= minFaceSize;
        });
        
        // 얼굴 크기 순으로 정렬 (큰 얼굴 = 가까운 사람)
        const sortedDetections = filteredDetections.sort((a, b) => {
          const sizeA = a.detection.box.width * a.detection.box.height;
          const sizeB = b.detection.box.width * b.detection.box.height;
          return sizeB - sizeA;
        });
        
        // 최대 5명까지만 처리 (성능 최적화)
        const limitedDetections = sortedDetections.slice(0, 5);
        
        if (limitedDetections.length === 0) {
          setErrorMessage('카메라에 더 가까이 오시거나\n정면을 바라봐 주세요.');
          setShowErrorModal(true);
        } else {
          const newVisitors = limitedDetections.map((d) => ({
            id: generateUniqueId(),
            ageGroup: convertToGroup(d.age, ageCorrection),
            gender: d.gender,
            source: 'AI'
          }));
          setScannedVisitors(newVisitors);
          setShowScanConfirm(true);
        }
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } catch (error) {
      console.error(error);
      setErrorMessage('스캔 실패.\n다시 시도해주세요.');
      setShowErrorModal(true);
    } finally {
      setIsScanning(false);
      // 0.3초 디바운스 (연속 스캔 방지)
      scanDebounceRef.current = setTimeout(() => {
        scanDebounceRef.current = null;
      }, 300);
    }
  }, [isModelLoaded, isScanning]);

  const clearScanDebounce = useCallback(() => {
    if (scanDebounceRef.current) {
      clearTimeout(scanDebounceRef.current);
      scanDebounceRef.current = null;
    }
  }, []);

  const handleScanConfirm = async () => {
    if (scannedVisitors.length === 0) return;
    await submitVisitors(scannedVisitors, true);
    setIsScanning(false);
  };

  const submitVisitors = async (visitorsToSubmit, isScanConfirm = false) => {
    const roomLocation = localStorage.getItem('room_location');
    if (!roomLocation) {
      setErrorMessage('관람실이 설정되지 않았습니다.\n관리자 대시보드에서 설정해주세요.');
      setShowErrorModal(true);
      return;
    }

    if (!db) {
      setErrorMessage('Firebase가 설정되지 않았습니다.\n관리자에게 문의하세요.');
      setShowErrorModal(true);
      return;
    }
    
    if (!navigator.onLine) {
      setErrorMessage('인터넷 연결이 없습니다.\n네트워크 연결을 확인해주세요.');
      setShowErrorModal(true);
      return;
    }
    
    if (isSending) return;
    setIsSending(true);
    
    const today = new Date().toISOString().split('T')[0]; // ISO 형식: YYYY-MM-DD
    const savedCount = localStorage.getItem(`visitorCount_${today}`);
    const previousCount = savedCount ? parseInt(savedCount, 10) : 0;
    const todayDataKey = `todayVisitors_${today}`;
    const previousVisitors = localStorage.getItem(todayDataKey);
    
    try {
      // Firebase에 저장 (한글로 변환)
      const visitorsWithTimestamp = visitorsToSubmit.map(visitor => ({
        gender: GENDER_MAP[visitor.gender] || visitor.gender,
        ageGroup: AGE_GROUP_ID_TO_LABEL[visitor.ageGroup] || visitor.ageGroup,
        ...(visitor.source && { source: SOURCE_MAP[visitor.source] || visitor.source }),
        location: roomLocation,
        timestamp: serverTimestamp()
      }));
      
      await Promise.all(
        visitorsWithTimestamp.map(visitor =>
          addDoc(collection(db, "visitors"), visitor)
        )
      );
      
      const totalCount = previousCount + visitorsToSubmit.length;
      localStorage.setItem(`visitorCount_${today}`, totalCount.toString());
      
      let existingVisitors = [];
      if (previousVisitors) {
        try {
          const parsed = JSON.parse(previousVisitors);
          existingVisitors = Array.isArray(parsed) ? parsed : [];
        } catch (parseError) {
          console.warn('오늘 방문객 데이터 파싱 실패:', parseError);
          existingVisitors = [];
        }
      }
      const visitorsWithRoom = visitorsToSubmit.map(v => ({ ...v, location: roomLocation }));
      existingVisitors.push(...visitorsWithRoom);
      localStorage.setItem(todayDataKey, JSON.stringify(existingVisitors));
      
      setLastCount(visitorsToSubmit.length);
      setShowModal(true);
      
      // 상태 정리 (배칭 최소화)
      if (isScanConfirm) {
        setShowScanConfirm(false);
        setScannedVisitors([]);
        setIsAIMode(false);  // 수동 모드로 복구
      } else {
        setVisitors([]);
        setIsAIMode(false);
      }
    } catch (error) {
      console.error("Firebase 전송 실패:", error);
      
      let errorMsg = 'Firebase 전송 실패';
      if (error.code === 'permission-denied') {
        errorMsg = '권한이 없습니다.\n관리자에게 문의하세요.';
      } else if (error.code === 'unavailable' || error.message?.includes('network') || error.message?.includes('Failed to fetch')) {
        errorMsg = '서버 연결에 실패했습니다.\n인터넷 연결을 확인하고 다시 시도해주세요.';
      } else {
        errorMsg = '데이터 전송에 실패했습니다.\n' + (error.message || '알 수 없는 오류');
      }
      
      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setIsSending(false);
      // 스캔 모드에서는 즉시 스캔 가능 상태
      if (isScanConfirm) {
        clearScanDebounce();
      }
    }
  };

  const handleScanEdit = () => {
    setScannedVisitors([]);
    setShowScanConfirm(false);
    stopVideo();
    setIsAIMode(false);  // 수동 모드로 전환 (스캔 결과는 리스트에 추가하지 않음)
  };

  const handleScanCancel = () => {
    clearScanDebounce();
    setShowScanConfirm(false);
    setScannedVisitors([]);
    setIsScanning(false);
  };

  const handleToggleMode = () => {
    if (isAIMode) {
      stopVideo();
      setIsScanning(false);
      setShowScanConfirm(false);
      setScannedVisitors([]);
    }
    setIsAIMode((prev) => !prev);
  };

  const addManualVisitor = useCallback((visitorOverride) => {
    if (visitorOverride) {
      setVisitors(prev => [...prev, visitorOverride]);
      return;
    }

    const newVisitor = {
      id: generateUniqueId(),
      ageGroup: manualGroup,
      gender: manualGender,
      source: 'Manual'
    };
    setVisitors(prev => [...prev, newVisitor]);
  }, [manualGroup, manualGender]);

  const removeVisitor = (id) => {
    setVisitors(prev => prev.filter(v => v.id !== id));
  };

  const resetVisitors = () => {
    setVisitors([]);
  };

  const submitData = async () => {
    if (visitors.length === 0) return;
    setShowSubmitConfirm(true);
  };

  const handleSubmitConfirm = async () => {
    setShowSubmitConfirm(false);
    await submitVisitors(visitors, false);
  };

  if (isAdminLocked) {
    return <AdminLockScreen onUnlock={() => setIsAdminLocked(false)} />;
  }

  if (showRoomSetup) {
    return <AdminLockScreen onUnlock={handleRoomSetupComplete} />;
  } 

  return (
    <div style={styles.pageBackground}>
      <SuccessModal isOpen={showModal} onClose={() => setShowModal(false)} count={lastCount} />
      <ErrorModal 
        isOpen={showErrorModal} 
        onClose={() => setShowErrorModal(false)}
        onRetry={() => {
          setShowErrorModal(false);
          if (scannedVisitors.length > 0) {
            handleScanConfirm();
          } else if (visitors.length > 0) {
            submitData();
          } else if (isAIMode) {
            scanFaces();
          }
        }}
        message={errorMessage}
        showRetry={scannedVisitors.length > 0 || visitors.length > 0 || isAIMode}
      />
      <ScanConfirmModal 
        isOpen={showScanConfirm}
        onClose={handleScanCancel}
        scannedVisitors={scannedVisitors}
        onConfirm={handleScanConfirm}
        onEdit={handleScanEdit}
      />
      <SubmitConfirmModal
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        onConfirm={handleSubmitConfirm}
        count={visitors.length}
        visitors={visitors}
      />
      
      <div style={styles.container}>
        <header style={styles.header}>
          <img 
            src={logoImg} 
            alt="RAIM Logo" 
            style={{...styles.logoImage, cursor: 'pointer'}} 
            onClick={handleLogoClick}
            title="로고를 3회 터치하여 관리자 대시보드 열기"
          />
          <h2 style={styles.title}>{t('header.title')}</h2>
          <LanguageToggle isMobile={isMobile} inline={true} />
        </header>
        
        <div style={styles.topRow}>
          {isAIMode ? (
            <CameraCard
              videoRef={videoRef}
              isModelLoaded={isModelLoaded}
              isScanning={isScanning}
              onScan={scanFaces}
              style={{ width: '100%' }}
            />
          ) : (
            <ManualEntryCard
              manualGender={manualGender}
              setManualGender={setManualGender}
              manualGroup={manualGroup}
              setManualGroup={setManualGroup}
              ageGroups={DEFAULT_AGE_GROUPS}
              onAdd={addManualVisitor}
              style={{ width: '100%' }}
            />
          )}
        </div>

        <div style={styles.bottomRow}>
          <VisitorList
            visitors={visitors}
            onRemove={removeVisitor}
            onAdd={addManualVisitor}
            onReset={resetVisitors}
          />
        </div>

        <div style={styles.buttonRow}>
          <button 
            onClick={handleToggleMode}
            style={styles.modeSwitchButton}
          >
            {isAIMode ? (t('dashboard.settings.manualMode') || '수동 입력') : (t('dashboard.settings.aiMode') || 'AI 인식')}
          </button>

          <button 
            onClick={submitData}
            disabled={isSending || visitors.length === 0}
            style={{ 
              ...styles.submitButton,
              ...(visitors.length > 0 ? styles.submitButtonActive : styles.submitButtonDisabled),
              flex: 2
            }}>
            {isSending ? t('common.sending') : `${t('common.complete')} (${t('common.peopleCount', { count: visitors.length })})`}
          </button>
        </div>
      </div>
      
      {showDashboard && (
        <Dashboard 
          onClose={() => setShowDashboard(false)}
          onSave={() => setShowDashboard(false)}
        />
      )}
      
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}

const getStyles = (device) => {
  const pick = (map) => map[device] ?? map.desktop;
    const radius = pick({ mobile: '18px', tabletA9: '24px', desktop: '28px' });

  return {
    pageBackground: { 
      minHeight: '100vh', 
      backgroundColor: RAIM_COLORS.BG, 
      padding: pick({ mobile: '10px', tabletA9: '16px', desktop: '22px' }), 
      boxSizing: 'border-box' 
    },
    container: { 
      maxWidth: pick({ mobile: '100%', tabletA9: '1200px', desktop: '1400px' }), 
      margin: '0 auto', 
      backgroundColor: '#ffffff', 
      borderRadius: radius, 
      padding: pick({ mobile: '14px', tabletA9: '22px', desktop: '26px' }), 
      boxShadow: '0 14px 36px rgba(0, 68, 139, 0.08)', 
      width: '100%', 
      boxSizing: 'border-box', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: 0
    }, 
    header: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      alignItems: 'center',
      gap: pick({ mobile: '12px', tabletA9: '16px', desktop: '18px' }),
      marginBottom: pick({ mobile: '10px', tabletA9: '16px', desktop: '18px' }),
      height: pick({ mobile: '60px', tabletA9: '90px', desktop: '100px' }),
      width: 'auto',
      paddingBottom: '10px',
      borderBottom: `2px solid ${RAIM_COLORS.BG}`
    },
    logoImage: { 
      height: pick({ mobile: '40px', tabletA9: '70px', desktop: '100px' }), width: 'auto' 
    },
    title: { 
      margin: 0, 
      fontSize: pick({ mobile: '15px', tabletA9: '26px', desktop: '30px' }), 
      color: RAIM_COLORS.DARK, 
      fontWeight: '800',
      textAlign: 'center',
      gridColumn: '2'
    },
    topRow: { 
      display: 'flex', 
      flexDirection: 'row', 
      gap: pick({ mobile: '8px', tabletA9: '14px', desktop: '18px' }), 
      marginBottom: 0,
      height: pick({ mobile: '220px', tabletA9: '600px', desktop: '720px' }) 
    },
    bottomRow: { 
      display: 'flex', 
      flexDirection: 'column', 
      flex: 1,
      marginTop: 0,
      minHeight: pick({ mobile: '180px', tabletA9: '350px', desktop: '440px' })
    },
    buttonRow: {
      display: 'flex',
      flexDirection: pick({ mobile: 'row', tabletA9: 'row', desktop: 'row' }),
      flexWrap: 'nowrap',
      alignItems: 'stretch',
      gap: pick({ mobile: '10px', tabletA9: '14px', desktop: '15px' }),
      marginTop: pick({ mobile: '12px', tabletA9: '16px', desktop: '18px' })
    },
    modeSwitchButton: {
      padding: pick({ mobile: '14px', tabletA9: '19px', desktop: '20px' }),
      fontSize: pick({ mobile: '13px', tabletA9: '20px', desktop: '21px' }),
      fontWeight: '800',
      background: `linear-gradient(135deg, ${RAIM_COLORS.TEAL}, ${RAIM_COLORS.SKY})`,
      color: 'white',
      border: 'none',
      borderRadius: radius,
      cursor: 'pointer',
      transition: 'all 0.3s',
      flex: 1,
      boxShadow: '0 4px 12px rgba(0, 191, 223, 0.25)',
      minHeight: pick({ mobile: '52px', tabletA9: '60px', desktop: '64px' })
    },
    submitButton: { 
      flex: pick({ mobile: 1, tabletA9: 2, desktop: 2 }), display:'flex', alignItems:'center', 
      justifyContent:'center', 
      padding: pick({ mobile: '14px', tabletA9: '19px', desktop: '20px' }), 
      fontSize: pick({ mobile: '17px', tabletA9: '20px', desktop: '21px' }), 
      minHeight: pick({ mobile: '52px', tabletA9: '60px', desktop: '64px' }),
      fontWeight: '800', 
      border: 'none', 
      borderRadius: radius, 
      transition: 'all 0.3s', 
      margin: 0,
    },
    submitButtonActive: { 
      background: `linear-gradient(135deg, ${RAIM_COLORS.MEDIUM}, ${RAIM_COLORS.DARK})`, 
      color: 'white', cursor: 'pointer', 
      boxShadow: '0 8px 20px rgba(0, 68, 139, 0.25)' 
    },
    submitButtonDisabled: { 
      backgroundColor: '#E2E8F0', color: '#94A3B8', cursor: 'not-allowed' 
    }
  };
};

export default App;