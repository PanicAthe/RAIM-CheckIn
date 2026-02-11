import { X, AlertCircle, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { RAIM_COLORS, AGE_GROUP_LABEL_TO_ID } from '../../constants';

const getStyles = (device) => {
  const pick = (map) => map[device] ?? map.desktop;
  const radius = pick({ mobile: '20px', tabletA9: '26px', desktop: '28px' });

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
      padding: pick({ mobile: '12px', tabletA9: '18px', desktop: '20px' }),
      boxSizing: 'border-box'
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: radius,
      padding: pick({ mobile: '24px', tabletA9: '36px', desktop: '40px' }),
      maxWidth: pick({ mobile: '540px', tabletA9: '720px', desktop: '760px' }),
      width: '100%',
      maxHeight: '85vh',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: pick({ mobile: '18px', tabletA9: '26px', desktop: '30px' })
    },
    modalTitle: {
      fontSize: pick({ mobile: '22px', tabletA9: '26px', desktop: '28px' }),
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
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: RAIM_COLORS.MUTED,
      transition: 'color 0.2s'
    },
    visitorCount: {
      fontSize: pick({ mobile: '20px', tabletA9: '30px', desktop: '24px' }),
      fontWeight: '700',
      color: RAIM_COLORS.DARK,
      marginBottom: pick({ mobile: '16px', tabletA9: '22px', desktop: '24px' }),
      textAlign: 'center',
      paddingBottom: pick({ mobile: '16px', tabletA9: '22px', desktop: '24px' }),
      borderBottom: `2px solid ${RAIM_COLORS.BG}`
    },
    buttonGroup: {
      display: 'flex',
      gap: pick({ mobile: '12px', tabletA9: '16px', desktop: '16px' }),
      marginTop: pick({ mobile: '20px', tabletA9: '28px', desktop: '32px' })
    },
    cancelButton: {
      flex: 1,
      padding: pick({ mobile: '14px', tabletA9: '18px', desktop: '18px' }),
      fontSize: pick({ mobile: '16px', tabletA9: '18px', desktop: '18px' }),
      fontWeight: '700',
      backgroundColor: '#F3F4F6',
      color: RAIM_COLORS.MUTED,
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    confirmButton: {
      flex: 1,
      padding: pick({ mobile: '14px', tabletA9: '18px', desktop: '18px' }),
      fontSize: pick({ mobile: '16px', tabletA9: '18px', desktop: '18px' }),
      fontWeight: '700',
      background: `linear-gradient(135deg, ${RAIM_COLORS.MEDIUM}, ${RAIM_COLORS.DARK})`,

      color: 'white',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxShadow: '0 8px 20px rgba(0, 68, 139, 0.25)'
    },
    visitorsList: {
      backgroundColor: 'linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 100%)',
      borderRadius: '14px',
      padding: pick({ mobile: '14px', tabletA9: '16px', desktop: '16px' }),
      marginBottom: pick({ mobile: '16px', tabletA9: '22px', desktop: '24px' }),
      border: `2px solid ${RAIM_COLORS.SKY}`,
      background: `linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 100%)`
    },
    visitorItem: {
      fontSize: pick({ mobile: '16px', tabletA9: '22px', desktop: '16px' }),
      color: RAIM_COLORS.DARK,
      fontWeight: '600',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: pick({ mobile: '6px', tabletA9: '8px', desktop: '8px' })
    },
    visitorBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: pick({ mobile: '15px', tabletA9: '16px', desktop: '14px' }),
      padding: pick({ mobile: '4px 10px', tabletA9: '4px 10px', desktop: '4px 10px' }),
      borderRadius: '6px',
      backgroundColor: RAIM_COLORS.MEDIUM,
      color: 'white',
      fontWeight: '800',
      minWidth: '32px',
      boxShadow: '0 2px 8px rgba(0, 68, 139, 0.2)'
    }
  };
};

export default function SubmitConfirmModal({ isOpen, onClose, onConfirm, count, visitors = [] }) {
  const { t } = useTranslation();
  const { device } = useIsMobile();
  const styles = getStyles(device);

  // 성별과 연령대별로 방문객 그룹화
  const visitorGroups = useMemo(() => {
    const groups = {};
    visitors.forEach(visitor => {
      const key = `${visitor.gender}-${visitor.ageGroup}`;
      if (!groups[key]) {
        groups[key] = {
          gender: visitor.gender,
          ageGroup: visitor.ageGroup,
          count: 0
        };
      }
      groups[key].count++;
    });
    return Object.values(groups);
  }, [visitors]);

  if (!isOpen) return null;



  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            <AlertCircle size={28} color={RAIM_COLORS.MEDIUM} />
            {t('common.confirm') || '확인'}
          </h2>
          <button
            onClick={onClose}
            style={styles.closeButton}
          >
            <X size={24} />
          </button>
        </div>

        <div style={styles.visitorCount}>
          {t('submitConfirm.message', { count })}
        </div>

        {visitorGroups.length > 0 && (
          <div style={styles.visitorsList}>
            {visitorGroups.map((group, idx) => (
              <div key={idx} style={styles.visitorItem}>
                <span>{t(group.gender === 'male' ? 'common.male' : 'common.female')} {t(`ageGroups.${group.ageGroup}`)}</span>
                <span style={styles.visitorBadge}>{group.count}</span>
              </div>
            ))}
          </div>
        )}

        <div style={styles.buttonGroup}>
          <button
            onClick={onClose}
            style={styles.cancelButton}
          >
            {t('common.cancel') || '취소'}
          </button>
          <button
            onClick={onConfirm}
            style={styles.confirmButton}
          >
            <Check size={20} />
            {t('common.confirm') || '확인'}
          </button>
        </div>
      </div>
    </div>
  );
}
