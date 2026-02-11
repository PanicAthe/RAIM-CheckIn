import { CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../../hooks/useIsMobile';
import { RAIM_COLORS } from '../../constants';

const getStyles = (device) => {
  const pick = (map) => map[device] ?? map.desktop;

  return {
    overlay: { 
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', 
      alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' 
    },
    container: { 
      backgroundColor: 'white', 
      padding: pick({ mobile: '30px', tabletA9: '40px', desktop: '45px' }), 
      borderRadius: '24px', 
      textAlign: 'center', 
      maxWidth: pick({ mobile: '320px', tabletA9: '500px', desktop: '520px' }), 
      width: '90%', 
      boxShadow: '0 20px 50px rgba(0,0,0,0.2)', 
      animation: 'fadeIn 0.3s ease-out' 
    },
    iconCircle: { 
      width: pick({ mobile: '70px', tabletA9: '100px', desktop: '110px' }), 
      height: pick({ mobile: '70px', tabletA9: '100px', desktop: '110px' }), 
      borderRadius: '50%', 
      backgroundColor: RAIM_COLORS.TEAL, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      margin: '0 auto ' + pick({ mobile: '20px', tabletA9: '30px', desktop: '30px' }) + ' auto',
      boxShadow: '0 10px 20px rgba(31, 189, 198, 0.3)' 
    },
    title: { 
      margin: '0 0 10px 0', 
      fontSize: pick({ mobile: '24px', tabletA9: '36px', desktop: '40px' }), 
      fontWeight: '800', 
      color: RAIM_COLORS.DARK 
    },
    message: { 
      margin: '0 0 25px 0', 
      fontSize: pick({ mobile: '16px', tabletA9: '22px', desktop: '24px' }), 
      color: '#666', 
      lineHeight: '1.6' 
    },
    button: { 
      width: '100%', 
      padding: pick({ mobile: '15px', tabletA9: '20px', desktop: '22px' }), 
      backgroundColor: RAIM_COLORS.DARK, 
      color: 'white', 
      border: 'none', 
      borderRadius: '12px', 
      fontSize: pick({ mobile: '16px', tabletA9: '20px', desktop: '22px' }), 
      fontWeight: 'bold', 
      cursor: 'pointer' 
    }
  };
};

export default function SuccessModal({ isOpen, onClose, count }) {
  const { t } = useTranslation();
  const { device } = useIsMobile();
  const styles = getStyles(device);
  
  const pick = (map) => map[device] ?? map.desktop;
  
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.iconCircle}>
          <CheckCircle2 size={pick({ mobile: 40, tabletA9: 60, desktop: 70 })} color="white" />
        </div>
        <h2 style={styles.title}>{t('successModal.title')}</h2>
        <p style={styles.message}>
          {t('successModal.message', { count })}<br/>
          {t('successModal.enjoyMessage')}
        </p>
        <button onClick={onClose} style={styles.button}>{t('common.confirm')}</button>
      </div>
    </div>
  );
}
