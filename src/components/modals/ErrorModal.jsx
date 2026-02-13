import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../../hooks/useIsMobile';
import { RAIM_COLORS } from '../../constants';

const getStyles = (device) => {
  const pick = (map) => map[device] ?? map.desktop;

  return {
    overlay: { 
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', 
      alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' 
    },
    container: { 
      backgroundColor: 'white', 
      padding: pick({ mobile: '30px', tabletA9: '40px', desktop: '45px' }), 
      borderRadius: '24px', 
      textAlign: 'center', 
      maxWidth: pick({ mobile: '320px', tabletA9: '500px', desktop: '520px' }), 
      width: '90%', 
      boxShadow: '0 20px 50px rgba(0,0,0,0.3)', 
      animation: 'fadeIn 0.3s ease-out' 
    },
    iconCircle: { 
      width: pick({ mobile: '70px', tabletA9: '100px', desktop: '110px' }), 
      height: pick({ mobile: '70px', tabletA9: '100px', desktop: '110px' }), 
      borderRadius: '50%', 
      backgroundColor: '#FEE2E2', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      margin: '0 auto ' + pick({ mobile: '20px', tabletA9: '30px', desktop: '30px' }) + ' auto',
      boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)' 
    },
    title: { 
      margin: '0 0 10px 0', 
      fontSize: pick({ mobile: '24px', tabletA9: '36px', desktop: '40px' }), 
      fontWeight: '800', 
      color: '#DC2626' 
    },
    message: { 
      margin: '0 0 25px 0', 
      fontSize: pick({ mobile: '16px', tabletA9: '22px', desktop: '24px' }), 
      color: '#666', 
      lineHeight: '1.6',
      whiteSpace: 'pre-line'
    },
    buttonRow: {
      display: 'flex',
      gap: pick({ mobile: '10px', tabletA9: '12px', desktop: '12px' }),
      justifyContent: 'center'
    },
    retryButton: { 
      flex: 1,
      padding: pick({ mobile: '15px', tabletA9: '18px', desktop: '20px' }), 
      backgroundColor: RAIM_COLORS.DARK, 
      color: 'white', 
      border: 'none', 
      borderRadius: '12px', 
      fontSize: pick({ mobile: '16px', tabletA9: '18px', desktop: '20px' }), 
      fontWeight: 'bold', 
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    cancelButton: { 
      flex: 1,
      padding: pick({ mobile: '15px', tabletA9: '18px', desktop: '20px' }), 
      backgroundColor: '#E5E7EB', 
      color: '#374151', 
      border: 'none', 
      borderRadius: '12px', 
      fontSize: pick({ mobile: '16px', tabletA9: '18px', desktop: '20px' }), 
      fontWeight: 'bold', 
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    }
  };
};

export default function ErrorModal({ isOpen, onClose, onRetry, message, messageKey, messageParams, showRetry = true }) {
  const { t } = useTranslation();
  const { device } = useIsMobile();
  const styles = getStyles(device);
  
  if (!isOpen) return null;
  
  // messageKey가 있으면 번역, 없으면 message 그대로 사용
  const displayMessage = messageKey ? t(messageKey, messageParams) : (message || t('errorModal.defaultMessage'));
  
  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.iconCircle}>
          <AlertCircle size={40} color="#DC2626" />
        </div>
        <h2 style={styles.title}>{t('errorModal.title')}</h2>
        <p style={styles.message}>
          {displayMessage}
        </p>
        <div style={styles.buttonRow}>
          <button onClick={onClose} style={styles.cancelButton}>
            <X size={18} />
            {t('common.close')}
          </button>
          {showRetry && (
            <button onClick={onRetry} style={styles.retryButton}>
              <RefreshCw size={18} />
              {t('common.retry')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
