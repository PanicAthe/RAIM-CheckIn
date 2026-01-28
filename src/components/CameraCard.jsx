import { ScanFace, ShieldCheck, Loader2 } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';
import { RAIM_COLORS } from '../constants';

const getStyles = (device) => {
  const pick = (map) => map[device] ?? map.desktop;

  return {
    cameraCard: { 
      flex: 1, position: 'relative', background: RAIM_COLORS.BLACK, 
      borderRadius: pick({ mobile: '18px', tabletA9: '22px', desktop: '24px' }), 
      overflow: 'hidden', display: 'flex', 
      flexDirection: 'column' 
    },
    privacyBadge: {
      position: 'absolute', top: pick({ mobile: '14px', tabletA9: '22px', desktop: '26px' }), left: '50%', transform: 'translateX(-50%)',
      display: 'flex', alignItems: 'center', gap: '8px',
      backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white',
      padding: pick({ mobile: '8px 14px', tabletA9: '11px 20px', desktop: '12px 22px' }), borderRadius: '24px',
      fontSize: pick({ mobile: '16px', tabletA9: '27px', desktop: '28px' }), fontWeight: '500', zIndex: 10,
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
      position: 'absolute', bottom: pick({ mobile: '14px', tabletA9: '18px', desktop: '20px' }), width: '100%', 
      display: 'flex', justifyContent: 'center', padding: '0 18px', 
      boxSizing: 'border-box',
      pointerEvents: 'none'
    },
    scanButton: { 
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', 
      width: pick({ mobile: '90%', tabletA9: '52%', desktop: '46%' }), padding: pick({ mobile: '10px', tabletA9: '20px', desktop: '22px' }), 
      fontSize: pick({ mobile: '18px', tabletA9: '25px', desktop: '26px' }), fontWeight: 'bold', 
      background: `linear-gradient(135deg, ${RAIM_COLORS.TEAL}F0, ${RAIM_COLORS.SKY}F0)`, 
      color: 'white', border: `1px solid ${RAIM_COLORS.TEAL}55`, borderRadius: pick({ mobile: '18px', tabletA9: '20px', desktop: '20px' }), 
      boxShadow: '0 14px 26px rgba(0, 191, 223, 0.28)', transition: 'all 0.2s ease', 
      whiteSpace: 'nowrap', minHeight: pick({ mobile: '50px', tabletA9: '70px', desktop: '72px' }),
      backdropFilter: 'blur(10px)',
      pointerEvents: 'auto'
    }
  };
};

export default function CameraCard({ 
  videoRef, 
  isModelLoaded, 
  isScanning, 
  onScan 
}) {
  const { device } = useIsMobile();
  const styles = getStyles(device);

  return (
    <div style={styles.cameraCard}>
      <div style={styles.privacyBadge}>
        <ShieldCheck size={30} strokeWidth={2.5} />
        <span>이미지는 저장되지 않습니다</span>
      </div>

      <video ref={videoRef} autoPlay muted playsInline style={styles.video} />
      {!isModelLoaded && (
        <div style={styles.loadingOverlay}>
          <Loader2 size={42} className="spin" color="white" />
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
            <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <>
              <ScanFace size={36} strokeWidth={2} />
              <span>AI 스캔</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
