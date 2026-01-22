import { ScanFace, ShieldCheck, Loader2 } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';
import { RAIM_COLORS } from '../constants';

const getStyles = (isMobile) => ({
  cameraCard: { 
    flex: 1, position: 'relative', background: RAIM_COLORS.BLACK, 
    borderRadius: '16px', overflow: 'hidden', display: 'flex', 
    flexDirection: 'column' 
  },
  privacyBadge: {
    position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
    display: 'flex', alignItems: 'center', gap: '4px',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white',
    padding: '6px 12px', borderRadius: '20px',
    fontSize: isMobile ? '10px' : '11px', fontWeight: '500', zIndex: 10,
    backdropFilter: 'blur(4px)', whiteSpace: 'nowrap', pointerEvents: 'none'
  },
  video: { 
    width: '100%', height: '100%', flex: 1, objectFit: 'cover', 
    transform: 'scaleX(-1)' 
  },
  loadingOverlay: { 
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
    display: 'flex', flexDirection: 'column', justifyContent: 'center', 
    alignItems: 'center', background: 'rgba(0,0,0,0.7)', color: 'white' 
  },
  scanOverlay: { 
    position: 'absolute', bottom: isMobile ? '10px' : '15px', width: '100%', 
    display: 'flex', justifyContent: 'center', padding: '0 10px', 
    boxSizing: 'border-box' 
  },
  scanButton: { 
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', 
    width: '100%', padding: isMobile ? '10px' : '14px', 
    fontSize: isMobile ? '13px' : '16px', fontWeight: 'bold', 
    background: `linear-gradient(90deg, ${RAIM_COLORS.TEAL}, ${RAIM_COLORS.SKY})`, 
    color: 'white', border: 'none', borderRadius: '12px', 
    boxShadow: '0 4px 12px rgba(31, 189, 198, 0.4)', transition: 'all 0.2s', 
    whiteSpace: 'nowrap' 
  }
});

export default function CameraCard({ 
  videoRef, 
  isModelLoaded, 
  isScanning, 
  onScan 
}) {
  const isMobile = useIsMobile();
  const styles = getStyles(isMobile);

  return (
    <div style={styles.cameraCard}>
      <div style={styles.privacyBadge}>
        <ShieldCheck size={12} strokeWidth={2.5} />
        <span>이미지는 저장되지 않습니다</span>
      </div>

      <video ref={videoRef} autoPlay muted playsInline style={styles.video} />
      {!isModelLoaded && (
        <div style={styles.loadingOverlay}>
          <Loader2 size={30} className="spin" color="white" />
        </div>
      )}
      <div style={styles.scanOverlay}>
        <button 
          onClick={onScan} 
          disabled={!isModelLoaded || isScanning} 
          style={{
            ...styles.scanButton,
            opacity: (!isModelLoaded || isScanning) ? 0.7 : 1
          }}
        >
          {isScanning ? (
            <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <>
              <ScanFace size={20} strokeWidth={2} />
              <span>AI 스캔</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
