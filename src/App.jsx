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

function App() {
  const [isAdminLocked, setIsAdminLocked] = useState(false);
  const [showRoomSetup, setShowRoomSetup] = useState(false);

  const videoRef = useRef();
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [visitors, setVisitors] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [lastCount, setLastCount] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);

  const [manualGender, setManualGender] = useState('male');
  const [manualGroup, setManualGroup] = useState('청년');

  // 로고 클릭 추적 (3회 클릭으로 대시보드 열기)
  const [logoClickCount, setLogoClickCount] = useState(0);
  const logoClickTimeoutRef = useRef(null);

  const isMobile = useIsMobile();
  const styles = getStyles(isMobile);

  useEffect(() => {
    const roomId = localStorage.getItem('room_id');
    if (!roomId) {
      setShowRoomSetup(true);
    }
  }, []);

  useEffect(() => {
    if (isAdminLocked || showRoomSetup) return;

    const loadModels = async () => {
      const MODEL_URL = '/models';
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
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
  }, [isAdminLocked, showDashboard, showRoomSetup]);

  // 대시보드 열고 닫을 때 카메라 제어
  useEffect(() => {
    if (showDashboard) {
      stopVideo(); // 대시보드 열 때 카메라 정지
    } else if (isModelLoaded) {
      startVideo(); // 대시보드 닫을 때 카메라 재시작
    }
  }, [showDashboard, isModelLoaded]);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
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

    try {
      // 저장된 나이 보정값 가져오기
      const savedCorrection = localStorage.getItem('ageCorrection');
      const ageCorrection = savedCorrection ? parseInt(savedCorrection, 10) : 4;

      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
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
        setVisitors(prev => [...prev, ...newVisitors]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsScanning(false);
    }
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
    
    const roomId = localStorage.getItem('room_id');
    if (!roomId) {
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
          location: roomId,
          timestamp: serverTimestamp(),
          date: new Date().toISOString().split('T')[0]
        });
      }
      
      setLastCount(currentCount);
      setShowModal(true);
      setVisitors([]);
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
          <ManualEntryCard
            manualGender={manualGender}
            setManualGender={setManualGender}
            manualGroup={manualGroup}
            setManualGroup={setManualGroup}
            onAdd={addManualVisitor}
          />
          <CameraCard
            videoRef={videoRef}
            isModelLoaded={isModelLoaded}
            isScanning={isScanning}
            onScan={scanFaces}
          />
        </div>

        <div style={styles.bottomRow}>
          <VisitorList
            visitors={visitors}
            onRemove={removeVisitor}
          />
        </div>

        <button 
          onClick={submitData}
          disabled={isSending || visitors.length === 0}
          style={{ 
            ...styles.submitButton,
            ...(visitors.length > 0 ? styles.submitButtonActive : styles.submitButtonDisabled)
          }}>
          {isSending ? "전송 중..." : `등록 완료 (${visitors.length}명)`}
        </button>
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

const getStyles = (isMobile) => ({
  pageBackground: { 
    minHeight: '100vh', backgroundColor: RAIM_COLORS.BG, 
    padding: isMobile ? '10px' : '20px', boxSizing: 'border-box' 
  },
  container: { 
    maxWidth: '1000px', margin: '0 auto', backgroundColor: '#ffffff', 
    borderRadius: '20px', padding: isMobile ? '15px' : '25px', 
    boxShadow: '0 10px 30px rgba(0, 68, 139, 0.08)', width: '100%', 
    boxSizing: 'border-box', overflow: 'hidden' 
  }, 
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: `2px solid ${RAIM_COLORS.BG}`
  },
  logoImage: { 
    height: isMobile ? '50px' : '80px', width: 'auto' 
  },
  title: { 
    margin: 0, fontSize: isMobile ? '18px' : '24px', 
    color: RAIM_COLORS.DARK, fontWeight: '800' 
  },
  topRow: { 
    display: 'flex', 
    flexDirection: 'row', 
    gap: isMobile ? '8px' : '20px', 
    marginBottom: '10px',
    height: isMobile ? '230px' : '360px' 
  },
  bottomRow: { 
    display: 'flex', flexDirection: 'column', flex: 1 
  },
  submitButton: { 
    width: '100%', display:'flex', alignItems:'center', 
    justifyContent:'center', padding: isMobile ? '14px' : '18px', 
    fontSize: isMobile ? '16px' : '18px', fontWeight: '800', 
    border: 'none', borderRadius: '16px', transition: 'all 0.3s', 
    marginTop: '10px' 
  },
  submitButtonActive: { 
    background: `linear-gradient(135deg, ${RAIM_COLORS.MEDIUM}, ${RAIM_COLORS.DARK})`, 
    color: 'white', cursor: 'pointer', 
    boxShadow: '0 8px 20px rgba(0, 68, 139, 0.25)' 
  },
  submitButtonDisabled: { 
    backgroundColor: '#E2E8F0', color: '#94A3B8', cursor: 'not-allowed' 
  }
});

export default App;