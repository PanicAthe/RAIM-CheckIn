import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import logoImg from './assets/logo.png';
import { useIsMobile } from './hooks/useIsMobile';
import { RAIM_COLORS } from './constants';
import { convertToGroup } from './utils/ageConverter';
import { db, collection, addDoc, serverTimestamp } from './firebase';
import SuccessModal from './components/SuccessModal';
import AdminLockScreen from './components/AdminLockScreen';
import ManualEntryCard from './components/ManualEntryCard';
import CameraCard from './components/CameraCard';
import VisitorList from './components/VisitorList';
import Dashboard from './components/Dashboard';
import ScanConfirmModal from './components/ScanConfirmModal';

function App() {
  const [isAdminLocked, setIsAdminLocked] = useState(false);
  const [showRoomSetup, setShowRoomSetup] = useState(false);

  const videoRef = useRef();
  const canvasRef = useRef(null); // 리사이징용 캔버스
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [visitors, setVisitors] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [lastCount, setLastCount] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showScanConfirm, setShowScanConfirm] = useState(false);
  const [scannedVisitors, setScannedVisitors] = useState([]);

  const [manualGender, setManualGender] = useState('male');
  const [manualGroup, setManualGroup] = useState('청년');
  const [isAIMode, setIsAIMode] = useState(true);

  // 로고 클릭 추적 (3회 클릭으로 대시보드 열기)
  const [logoClickCount, setLogoClickCount] = useState(0);
  const logoClickTimeoutRef = useRef(null);

  const { isMobile, isTablet, device } = useIsMobile();
  const isDesktop = device === 'desktop';
  const styles = getStyles(device);

  useEffect(() => {
    const roomLocation = localStorage.getItem('room_location');
    if (!roomLocation) {
      setShowRoomSetup(true);
    }
  }, []);

  useEffect(() => {
    if (isAdminLocked || showRoomSetup) return;

    const loadModels = async () => {
      const MODEL_URL = '/models';
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL), // 경량 모델 추가
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL), // 경량 랜드마크
          faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelLoaded(true);
        // 대시보드가 열려있지 않을 때만 비디오 시작
        if (!showDashboard) {
          startVideo();
        }
      } catch (e) {
        console.error("모델 로딩 실패:", e);
      }
    };
    loadModels();
  }, [isAdminLocked, showDashboard, showRoomSetup, isAIMode]);

  // 대시보드 열고 닫을 때 카메라 제어
  useEffect(() => {
    if (showDashboard) {
      stopVideo(); // 대시보드 열 때 카메라 정지
    } else if (isModelLoaded && isAIMode) {
      startVideo(); // 대시보드 닫을 때 AI 모드면 카메라 재시작
    }
  }, [showDashboard, isModelLoaded, isAIMode]);

  // AI 모드 전환 시 카메라 제어
  useEffect(() => {
    if (isAIMode && isModelLoaded && !showDashboard) {
      startVideo(); // AI 모드로 전환 시 카메라 시작
    } else {
      stopVideo(); // 수동 모드로 전환 시 카메라 정지
    }
  }, [isAIMode, isModelLoaded, showDashboard]);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'user',
        width: { ideal: 640 }, // 해상도 제한으로 처리 속도 향상
        height: { ideal: 480 }
      } 
    })
      .then((stream) => { 
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("카메라 에러:", err));
  };

  // 카메라 스트림 정지
  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopVideo();
      if (canvasRef.current) {
        canvasRef.current = null;
      }
    };
  }, []);

  // 로고 클릭 핸들러 (3회 클릭으로 대시보드 진입)
  const handleLogoClick = () => {
    const newClickCount = logoClickCount + 1;
    setLogoClickCount(newClickCount);

    // 기존 타이머 클리어
    if (logoClickTimeoutRef.current) {
      clearTimeout(logoClickTimeoutRef.current);
    }

    // 3회 클릭 시 대시보드 열기
    if (newClickCount === 3) {
      setShowDashboard(true);
      setLogoClickCount(0);
    } else {
      // 3초 이상 클릭이 없으면 카운트 초기화
      logoClickTimeoutRef.current = setTimeout(() => {
        setLogoClickCount(0);
      }, 3000);
    }
  };


  const scanFaces = async () => {
    if (!videoRef.current || !isModelLoaded || isScanning) return;
    setIsScanning(true);

    let canvas = null;
    try {
      // 저장된 나이 보정값 가져오기
      const savedCorrection = localStorage.getItem('ageCorrection');
      const ageCorrection = savedCorrection ? parseInt(savedCorrection, 10) : 4;

      // 비디오를 작은 캔버스로 리사이징 (처리 속도 대폭 향상)
      const maxDimension = 512; // 여러 명 감지를 위해 크기 증가
      const video = videoRef.current;
      const scale = Math.min(maxDimension / video.videoWidth, maxDimension / video.videoHeight);
      const width = video.videoWidth * scale;
      const height = video.videoHeight * scale;

      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }
      canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(video, 0, 0, width, height);

      // TinyFaceDetector 사용 (더 빠름, 입력 크기 조정 가능)
      const detections = await faceapi.detectAllFaces(
        canvas, // 리사이즈된 캔버스 사용
        new faceapi.TinyFaceDetectorOptions({ 
          inputSize: 320, // 여러 명 감지를 위해 증가 (속도와 감지율 균형)
          scoreThreshold: 0.4 // 임계값 낮춰 더 많은 얼굴 감지
        })
      )
        .withFaceLandmarks(true) // true = tiny 모델 사용
        .withAgeAndGender();

      if (detections.length === 0) {
        alert("얼굴을 찾을 수 없습니다.");
      } else {
        const newVisitors = detections.map(d => ({
          id: Date.now() + Math.random(),
          ageGroup: convertToGroup(d.age, ageCorrection),
          gender: d.gender,
          source: 'AI'
        }));
        setScannedVisitors(newVisitors);
        setShowScanConfirm(true);
      }
      
      // 메모리 정리
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } catch (error) {
      console.error(error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanConfirm = async () => {
    if (scannedVisitors.length === 0) return;
    
    const roomLocation = localStorage.getItem('room_location');
    if (!roomLocation) {
      alert('관람실이 설정되지 않았습니다. 관리자 대시보드에서 설정해주세요.');
      return;
    }
    
    try {
      setIsSending(true);
      const today = new Date().toDateString();
      const savedCount = localStorage.getItem(`visitorCount_${today}`);
      const totalCount = (savedCount ? parseInt(savedCount, 10) : 0) + scannedVisitors.length;
      localStorage.setItem(`visitorCount_${today}`, totalCount.toString());
      
      const todayDataKey = `todayVisitors_${today}`;
      const existingVisitors = localStorage.getItem(todayDataKey);
      const allVisitors = existingVisitors ? JSON.parse(existingVisitors) : [];
      allVisitors.push(...scannedVisitors);
      localStorage.setItem(todayDataKey, JSON.stringify(allVisitors));
      
      const formattedVisitors = scannedVisitors.map(visitor => ({
        ...visitor,
        gender: visitor.gender === 'male' ? '남성' : '여성',
        source: 'AI',
        ageGroup: visitor.ageGroup === '영유아' ? '영유아(~6세)' :
                  visitor.ageGroup === '어린이' ? '어린이(7세~12세)' :
                  visitor.ageGroup === '청소년' ? '청소년(13세~19세)' :
                  visitor.ageGroup === '청년' ? '청년(20세~39세)' :
                  visitor.ageGroup === '중년' ? '중년(40세~49세)' :
                  '장년(50세~)'
      }));
      
      for (const visitor of formattedVisitors) {
        await addDoc(collection(db, "visitors"), {
          ...visitor,
          location: roomLocation,
          timestamp: serverTimestamp()
        });
      }
      
      setLastCount(scannedVisitors.length);
      setShowModal(true);
      setShowScanConfirm(false);
      setScannedVisitors([]);
      setIsAIMode(true);
    } catch (error) {
      console.error("Firebase 전송 실패:", error);
      alert("데이터 전송 실패. 인터넷 연결을 확인해주세요.");
    } finally {
      setIsSending(false);
    }
  };

  const handleScanEdit = () => {
    setVisitors(prev => [...prev, ...scannedVisitors]);
    setShowScanConfirm(false);
    setIsAIMode(false);
    setScannedVisitors([]);
  };

  const handleScanCancel = () => {
    setShowScanConfirm(false);
    setScannedVisitors([]);
  };

  const handleToggleMode = () => {
    if (isAIMode) {
      // AI 모드에서 수동으로 전환할 때 카메라/스캔 상태 정리
      stopVideo();
      setIsScanning(false);
      setShowScanConfirm(false);
      setScannedVisitors([]);
    }
    setIsAIMode((prev) => !prev);
  };

  const addManualVisitor = () => {
    const newVisitor = {
      id: Date.now() + Math.random(),
      ageGroup: manualGroup,
      gender: manualGender,
      source: 'Manual'
    };
    setVisitors(prev => [...prev, newVisitor]);
  };

  const removeVisitor = (id) => {
    setVisitors(prev => prev.filter(v => v.id !== id));
  };

  const formatVisitorData = (visitors) => {
    return visitors.map(visitor => ({
      ...visitor,
      gender: visitor.gender === 'male' ? '남성' : '여성',
      source: visitor.source === 'Manual' ? '수동' : 'AI',
      ageGroup: visitor.ageGroup === '영유아' ? '영유아(~6세)' :
                visitor.ageGroup === '어린이' ? '어린이(7세~12세)' :
                visitor.ageGroup === '청소년' ? '청소년(13세~19세)' :
                visitor.ageGroup === '청년' ? '청년(20세~39세)' :
                visitor.ageGroup === '중년' ? '중년(40세~49세)' :
                '장년(50세~)'
    }));
  };

  const submitData = async () => {
    if (visitors.length === 0) return;
    
    const roomLocation = localStorage.getItem('room_location');
    if (!roomLocation) {
      alert('관람실이 설정되지 않았습니다. 관리자 대시보드에서 설정해주세요.');
      return;
    }
    
    setIsSending(true);
    const currentCount = visitors.length;
    
    // 오늘의 누적 입장객 수 저장
    const today = new Date().toDateString();
    const savedCount = localStorage.getItem(`visitorCount_${today}`);
    const totalCount = (savedCount ? parseInt(savedCount, 10) : 0) + currentCount;
    localStorage.setItem(`visitorCount_${today}`, totalCount.toString());
    
    // 오늘의 방문객 상세 데이터 저장 (그래프용)
    const todayDataKey = `todayVisitors_${today}`;
    const existingVisitors = localStorage.getItem(todayDataKey);
    const allVisitors = existingVisitors ? JSON.parse(existingVisitors) : [];
    allVisitors.push(...visitors);
    localStorage.setItem(todayDataKey, JSON.stringify(allVisitors));
    
    try {
      const formattedVisitors = formatVisitorData(visitors);
      
      // Firebase에 데이터 저장
      for (const visitor of formattedVisitors) {
        await addDoc(collection(db, "visitors"), {
          ...visitor,
          location: roomLocation,
          timestamp: serverTimestamp()
        });
      }
      
      setLastCount(currentCount);
      setShowModal(true);
      setVisitors([]);
      
      // 등록 완료 후 AI 모드로 전환하고 카메라 재시작
      setIsAIMode(true);
    } catch (error) {
      console.error("Firebase 전송 실패:", error);
      alert("데이터 전송 실패. 인터넷 연결을 확인해주세요.");
    } finally {
      setIsSending(false);
    }
  };

  if (isAdminLocked) {
    return <AdminLockScreen onUnlock={() => setIsAdminLocked(false)} />;
  }

  if (showRoomSetup) {
    return <AdminLockScreen onUnlock={() => setShowRoomSetup(false)} />;
  } 

  return (
    <div style={styles.pageBackground}>
      <SuccessModal isOpen={showModal} onClose={() => setShowModal(false)} count={lastCount} />
      <ScanConfirmModal 
        isOpen={showScanConfirm}
        onClose={handleScanCancel}
        scannedVisitors={scannedVisitors}
        onConfirm={handleScanConfirm}
        onEdit={handleScanEdit}
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
          <h2 style={styles.title}>입장 등록</h2>
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
          />
        </div>

        <div style={styles.buttonRow}>
          <button 
            onClick={submitData}
            disabled={isSending || visitors.length === 0}
            style={{ 
              ...styles.submitButton,
              ...(visitors.length > 0 ? styles.submitButtonActive : styles.submitButtonDisabled),
              flex: 2
            }}>
            {isSending ? "전송 중..." : `완료 (${visitors.length}명)`}
          </button>
          
          <button 
            onClick={handleToggleMode}
            style={styles.modeSwitchButton}
          >
            {isAIMode ? '수동 입력' : 'AI 인식'}
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
      overflow: 'hidden' 
    }, 
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: pick({ mobile: '12px', tabletA9: '16px', desktop: '18px' }),
      marginBottom: pick({ mobile: '10px', tabletA9: '16px', desktop: '18px' }),
      height: pick({ mobile: '60px', tabletA9: '90px', desktop: '100px' }),
      width: 'auto',
      paddingBottom: '10px',
      borderBottom: `2px solid ${RAIM_COLORS.BG}`
    },
    logoImage: { 
      height: pick({ mobile: '60px', tabletA9: '100px', desktop: '100px' }), width: 'auto' 
    },
    title: { 
      margin: 0, 
      fontSize: pick({ mobile: '20px', tabletA9: '26px', desktop: '30px' }), 
      color: RAIM_COLORS.DARK, 
      fontWeight: '800' 
    },
    topRow: { 
      display: 'flex', 
      flexDirection: 'row', 
      gap: pick({ mobile: '8px', tabletA9: '14px', desktop: '18px' }), 
      marginBottom: pick({ mobile: '10px', tabletA9: '14px', desktop: '16px' }),
      height: pick({ mobile: '300px', tabletA9: '600px', desktop: '720px' }) 
    },
    bottomRow: { 
      display: 'flex', 
      flexDirection: 'column', 
      flex: 0.8,
      minHeight: pick({ mobile: '200px', tabletA9: '280px', desktop: '300px' })
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
      fontSize: pick({ mobile: '17px', tabletA9: '20px', desktop: '21px' }),
      fontWeight: '800',
      backgroundColor: '#DC2626',
      color: 'white',
      border: 'none',
      borderRadius: radius,
      cursor: 'pointer',
      transition: 'all 0.3s',
      flex: 1,
      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
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