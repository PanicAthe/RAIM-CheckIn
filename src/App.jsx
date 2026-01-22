import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import logoImg from './assets/logo.png';
import { useIsMobile } from './hooks/useIsMobile';
import { GOOGLE_SCRIPT_URL, RAIM_COLORS } from './constants';
import { convertToGroup } from './utils/ageConverter';
import SuccessModal from './components/SuccessModal';
import AdminLockScreen from './components/AdminLockScreen';
import ManualEntryCard from './components/ManualEntryCard';
import CameraCard from './components/CameraCard';
import VisitorList from './components/VisitorList';

function App() {
  const [isAdminLocked, setIsAdminLocked] = useState(true);

  const videoRef = useRef();
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [visitors, setVisitors] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [lastCount, setLastCount] = useState(0);

  const [manualGender, setManualGender] = useState('male');
  const [manualGroup, setManualGroup] = useState('청년');

  const isMobile = useIsMobile();
  const styles = getStyles(isMobile);

  useEffect(() => {
    if (isAdminLocked) return;

    const loadModels = async () => {
      const MODEL_URL = '/models';
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelLoaded(true);
        startVideo();
      } catch (e) {
        console.error("모델 로딩 실패:", e);
      }
    };
    loadModels();
  }, [isAdminLocked]);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      .then((stream) => { 
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("카메라 에러:", err));
  };


  const scanFaces = async () => {
    if (!videoRef.current || !isModelLoaded || isScanning) return;
    setIsScanning(true);

    try {
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withAgeAndGender();

      if (detections.length === 0) {
        alert("얼굴을 찾을 수 없습니다.");
      } else {
        const newVisitors = detections.map(d => ({
          id: Date.now() + Math.random(),
          ageGroup: convertToGroup(d.age),
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

  const submitData = () => {
    if (visitors.length === 0) return;
    setIsSending(true);
    const currentCount = visitors.length;
    
    if (!GOOGLE_SCRIPT_URL) {
      alert("API URL 미설정");
      setIsSending(false);
      return;
    }

    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ visitors: visitors })
    }).then(() => {
      setLastCount(currentCount);
      setShowModal(true);
      setVisitors([]); 
      setIsSending(false);
    }).catch(() => {
        alert("전송 실패. 인터넷 연결을 확인해주세요.");
        setIsSending(false);
    });
  };

  if (isAdminLocked) {
    return <AdminLockScreen onUnlock={() => setIsAdminLocked(false)} />;
  }

  return (
    <div style={styles.pageBackground}>
      <SuccessModal isOpen={showModal} onClose={() => setShowModal(false)} count={lastCount} />

      <div style={styles.container}>
        <header style={styles.header}>
          <img src={logoImg} alt="RAIM Logo" style={styles.logoImage} />
          <div>
            <h2 style={styles.title}>입장 등록</h2>
          </div>
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