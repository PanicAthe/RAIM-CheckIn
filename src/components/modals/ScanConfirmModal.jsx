import { X, Check, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../../hooks/useIsMobile';
import { RAIM_COLORS, normalizeAgeGroupId } from '../../constants';

const getStyles = (device) => {
  const pick = (map) => map[device] ?? map.desktop;
  const radius = pick({ mobile: '20px', tablet: '24px', tabletA9: '26px', desktop: '28px' });

  return {
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: pick({ mobile: '12px', tablet: '16px', tabletA9: '18px', desktop: '20px' }),
      boxSizing: 'border-box'
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: radius,
      padding: pick({ mobile: '24px', tablet: '32px', tabletA9: '36px', desktop: '40px' }),
      maxWidth: pick({ mobile: '540px', tablet: '680px', tabletA9: '720px', desktop: '760px' }),
      width: '100%',
      maxHeight: '85vh',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: pick({ mobile: '18px', tablet: '24px', tabletA9: '26px', desktop: '30px' })
    },
    modalTitle: {
      fontSize: pick({ mobile: '22px', tablet: '24px', tabletA9: '26px', desktop: '28px' }),
      fontWeight: '700',
      color: RAIM_COLORS.DARK,
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '12px',
      transition: 'background 0.2s',
      minWidth: '48px',
      minHeight: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    visitorList: {
      maxHeight: pick({ mobile: '320px', tablet: '380px', tabletA9: '420px', desktop: '440px' }),
      overflowY: 'auto',
      marginBottom: pick({ mobile: '22px', tablet: '26px', tabletA9: '28px', desktop: '30px' }),
      border: `1px solid ${RAIM_COLORS.BG}`,
      borderRadius: '16px',
      padding: pick({ mobile: '14px', tablet: '18px', tabletA9: '20px', desktop: '20px' })
    },
    visitorItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: pick({ mobile: '12px', tablet: '13px', tabletA9: '14px', desktop: '14px' }),
      backgroundColor: RAIM_COLORS.BG,
      borderRadius: '12px',
      marginBottom: '12px'
    },
    visitorAvatar: {
      width: pick({ mobile: '42px', tablet: '46px', tabletA9: '48px', desktop: '48px' }),
      height: pick({ mobile: '42px', tablet: '46px', tabletA9: '48px', desktop: '48px' }),
      borderRadius: '50%',
      backgroundColor: RAIM_COLORS.DARK,
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: pick({ mobile: '16px', tablet: '17px', tabletA9: '18px', desktop: '18px' }),
      fontWeight: '600'
    },
    visitorInfo: {
      flex: 1
    },
    visitorAgeGroup: {
      fontSize: pick({ mobile: '18px', tablet: '19px', tabletA9: '20px', desktop: '20px' }),
      fontWeight: '600',
      color: RAIM_COLORS.DARK,
      marginBottom: '4px'
    },
    visitorBadges: {
      display: 'flex',
      gap: '6px'
    },
    badge: {
      fontSize: pick({ mobile: '14px', tablet: '15px', tabletA9: '16px', desktop: '16px' }),
      padding: '4px 10px',
      borderRadius: '8px',
      fontWeight: '600'
    },
    badgeGender: {
      backgroundColor: '#F3F4F6',
      color: '#4B5563'
    },
    badgeSource: {
      backgroundColor: RAIM_COLORS.TEAL + '22',
      color: '#0F766E',
      border: `1px solid ${RAIM_COLORS.TEAL}44`
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: pick({ mobile: '10px', tablet: '14px', tabletA9: '14px', desktop: '15px' })
    },
    confirmButton: {
      flex: 1,
      padding: pick({ mobile: '16px', tablet: '20px', tabletA9: '21px', desktop: '22px' }),
      backgroundColor: RAIM_COLORS.DARK,
      color: 'white',
      border: 'none',
      borderRadius: '16px',
      fontSize: pick({ mobile: '18px', tablet: '19px', tabletA9: '20px', desktop: '20px' }),
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transition: 'all 0.2s',
      minHeight: pick({ mobile: '58px', tablet: '64px', tabletA9: '66px', desktop: '70px' })
    },
    editButton: {
      flex: 1,
      padding: pick({ mobile: '16px', tablet: '20px', tabletA9: '21px', desktop: '22px' }),
      backgroundColor: '#F3F4F6',
      color: RAIM_COLORS.MUTED,
      border: 'none',
      borderRadius: '16px',
      fontSize: pick({ mobile: '18px', tablet: '19px', tabletA9: '20px', desktop: '20px' }),
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transition: 'all 0.2s',
      minHeight: pick({ mobile: '58px', tablet: '64px', tabletA9: '66px', desktop: '70px' })
    },
    alertMessage: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: pick({ mobile: '14px', tablet: '16px', tabletA9: '18px', desktop: '18px' }),
      backgroundColor: '#FEF3C7',
      border: '1px solid #F59E0B',
      borderRadius: '12px',
      marginBottom: pick({ mobile: '18px', tablet: '20px', tabletA9: '22px', desktop: '24px' }),
      fontSize: pick({ mobile: '15px', tablet: '16px', tabletA9: '17px', desktop: '17px' }),
      color: '#92400E',
      lineHeight: '1.5'
    }
  };
};

export default function ScanConfirmModal({ 
  isOpen, 
  onClose, 
  scannedVisitors, 
  onConfirm, 
  onEdit 
}) {
  const { t } = useTranslation();
  const { device } = useIsMobile();
  const styles = getStyles(device);

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>
            <AlertCircle size={28} color={RAIM_COLORS.MEDIUM} />
            {t('scanConfirm.title')}
          </h3>
          <button 
            style={styles.closeButton}
            onClick={onClose}
          >
            <X size={28} color={RAIM_COLORS.MUTED} />
          </button>
        </div>

        <div style={styles.alertMessage}>
          <AlertCircle size={20} />
          <span>{t('scanConfirm.editInfo')}</span>
        </div>

        <div style={styles.visitorList}>
          {scannedVisitors.map((visitor, index) => (
            <div key={visitor.id} style={styles.visitorItem}>
              <div style={styles.visitorAvatar}>
                {visitor.gender === 'male' ? t('common.male').charAt(0) : t('common.female').charAt(0)}
              </div>
              <div style={styles.visitorInfo}>
                <div style={styles.visitorAgeGroup}>{t(`ageGroups.${visitor.ageGroup}`)}</div>
                <div style={styles.visitorBadges}>
                  <span style={{...styles.badge, ...styles.badgeGender}}>
                    {visitor.gender === 'male' ? t('common.male') : t('common.female')}
                  </span>
                  <span style={{...styles.badge, ...styles.badgeSource}}>
                    {t('visitorList.aiTag')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.buttonContainer}>
          <button 
            style={styles.editButton}
            onClick={onEdit}
          >
            <AlertCircle size={22} />
            {t('scanConfirm.editButton')}
          </button>
          <button 
            style={styles.confirmButton}
            onClick={onConfirm}
          >
            <Check size={22} />
            {t('scanConfirm.confirmButton')}
          </button>
        </div>
      </div>
    </div>
  );
}
