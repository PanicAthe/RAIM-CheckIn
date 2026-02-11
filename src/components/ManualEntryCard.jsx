import { UserPlus, ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../hooks/useIsMobile';
import { RAIM_COLORS } from '../constants';
import { generateUniqueId } from '../utils/idGenerator';

const getStyles = (device) => {
  const pick = (map) => map[device] ?? map.desktop;
  const radius = pick({ mobile: '16px', tabletA9: '20px', desktop: '20px' });

  return {
    manualCard: { 
      flex: 1, border: `1px solid rgba(0, 68, 139, 0.12)`, borderRadius: radius, 
      padding: pick({ mobile: '10px', tabletA9: '16px', desktop: '18px' }), background: 'linear-gradient(180deg, #FFFFFF 0%, #F7FBFF 100%)', 
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: pick({ mobile: '6px', tabletA9: '10px', desktop: '12px' }),
      overflow: 'visible',
      boxShadow: '0 14px 32px rgba(0, 68, 139, 0.12)' 
    },
    cardHeaderRow: { 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      marginBottom: pick({ mobile: '4px', tabletA9: '5px', desktop: '8px' }), paddingBottom: '6px', 
      borderBottom: `1px solid ${RAIM_COLORS.BG}` 
    },
    cardTitleWrapper: { 
      display: 'flex', alignItems: 'center', gap: pick({ mobile: '8px', tabletA9: '10px', desktop: '10px' }) 
    },
    cardTitle: { 
      margin: 0, fontSize: pick({ mobile: '20px', tabletA9: '26px', desktop: '28px' }), 
      color: RAIM_COLORS.DARK, fontWeight: '700' 
    },
    inputGroup: { 
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      marginBottom: 0
    },
    inputLabel: { 
      display: 'block', marginBottom: '5px', fontSize: pick({ mobile: '16px', tabletA9: '20px', desktop: '21px' }), 
      fontWeight: '700', color: RAIM_COLORS.MUTED 
    },
    toggleButton: { 
      flex: 1, padding: pick({ mobile: '12px', tabletA9: '60px', desktop: '38px' }), 
      fontSize: pick({ mobile: '15px', tabletA9: '40px', desktop: '36px' }), 
      border: pick({ mobile: `1px solid ${RAIM_COLORS.DARK}50`, tabletA9: `2px solid ${RAIM_COLORS.DARK}50`, desktop: `2px solid ${RAIM_COLORS.DARK}50` }), borderRadius: pick({ mobile: '10px', tabletA9: '12px', desktop: '12px' }), 
      cursor: 'pointer', fontWeight: '700', backgroundColor: 'white', 
      color: RAIM_COLORS.MUTED, transition: 'all 0.2s', whiteSpace: 'nowrap',
      minHeight: pick({ mobile: '40px', tabletA9: '110px', desktop: '100px' }),
      boxShadow: '0 8px 18px rgba(0, 68, 139, 0.08)'
    },
    toggleButtonActive: { 
      backgroundColor: RAIM_COLORS.DARK, 
      border: `2px solid ${RAIM_COLORS.DARK}`, 
      color: 'white',
      boxShadow: '0 2px 8px rgba(0, 68, 139, 0.2)'
    },
    gridContainer: { 
      display: 'grid', gridTemplateColumns: pick({ mobile: 'repeat(3, 1fr)', tabletA9: 'repeat(3, 1fr)', desktop: 'repeat(3, 1fr)' }), 
      gap: pick({ mobile: '4px', tabletA9: '8px', desktop: '8px' })
    },
    ageButton: { 
      padding: pick({ mobile: '2px 0', tabletA9: '28px 0', desktop: '16px 0' }), 
      border: pick({ mobile: `1px solid ${RAIM_COLORS.DARK}50`, tabletA9: `2px solid ${RAIM_COLORS.DARK}50`, desktop: `2px solid ${RAIM_COLORS.DARK}50` }), borderRadius: pick({ mobile: '10px', tabletA9: '12px', desktop: '12px' }), 
      cursor: 'pointer', fontSize: pick({ mobile: '11px', tabletA9: '17px', desktop: '18px' }), 
      fontWeight: '800', backgroundColor: 'white', color: RAIM_COLORS.MUTED, 
      whiteSpace: 'nowrap',
      minHeight: pick({ mobile: '42px', tabletA9: '125px', desktop: '125px' }),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 6px 16px rgba(0, 68, 139, 0.08)'
    },
    ageLabel: {
      display: 'block',
      fontSize: pick({ mobile: '14px', tabletA9: '33px', desktop: '40px' }),
      fontWeight: '800'
    },
    ageSub: {
      display: 'block',
      fontSize: pick({ mobile: '9px', tabletA9: '24px', desktop: '26px' }),
      fontWeight: '600',
      opacity: 0.8,
      marginTop: '2px'
    },
    ageButtonActive: { 
      backgroundColor: RAIM_COLORS.DARK, 
      border: `2px solid ${RAIM_COLORS.DARK}`, 
      color: 'white',
      boxShadow: '0 2px 8px rgba(0, 68, 139, 0.2)'
    },
    addButton: { 
      width: '100%', display:'flex', alignItems:'center', 
      justifyContent:'center', gap: pick({ mobile: '6px', tabletA9: '8px', desktop: '8px' }), 
      padding: pick({ mobile: '8px', tabletA9: '20px', desktop: '14px' }), 
      fontSize: pick({ mobile: '16px', tabletA9: '21px', desktop: '22px' }), fontWeight: 'bold', 
      marginTop: pick({ mobile: '6px', tabletA9: '1px', desktop: '1px' }),
      background: `linear-gradient(135deg, ${RAIM_COLORS.TEAL}, ${RAIM_COLORS.SKY})`, color: 'white', 
      border: pick({ mobile: `0px solid ${RAIM_COLORS.MEDIUM}`, tabletA9: `0px solid ${RAIM_COLORS.MEDIUM}`, desktop: `0px solid ${RAIM_COLORS.MEDIUM}` }), borderRadius: pick({ mobile: '14px', tabletA9: '16px', desktop: '16px' }), 
      cursor: 'pointer', flexShrink: 0,
      minHeight: pick({ mobile: '40px', tabletA9: '56px', desktop: '58px' }),
      boxShadow: '0 10px 22px rgba(0, 191, 223, 0.25)'
    }
  };
};

export default function ManualEntryCard({ 
  manualGender, 
  setManualGender, 
  manualGroup, 
  setManualGroup, 
  ageGroups,
  onAdd 
}) {
  const { t } = useTranslation();
  const { device } = useIsMobile();
  const styles = getStyles(device);

  return (
    <div style={styles.manualCard}>
      <div style={styles.cardHeaderRow}>
        <div style={styles.cardTitleWrapper}>
          <UserPlus size={30} color={RAIM_COLORS.DARK} />
          <h3 style={styles.cardTitle}>{t('manualEntry.title')}</h3>
        </div>
      </div>
      
      <div style={styles.inputGroup}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            style={{ 
              ...styles.toggleButton, 
              ...(manualGender === 'male' ? styles.toggleButtonActive : {}) 
            }}
            onClick={() => setManualGender('male')}
          >
            {t('common.male')}
          </button>
          <button 
            style={{ 
              ...styles.toggleButton, 
              ...(manualGender === 'female' ? styles.toggleButtonActive : {}) 
            }}
            onClick={() => setManualGender('female')}
          >
            {t('common.female')}
          </button>
        </div>
      </div>

      <div style={styles.inputGroup}>
        <div style={styles.gridContainer}>
          {ageGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => {
                onAdd({
                  id: generateUniqueId(),
                  ageGroup: group.id,
                  gender: manualGender,
                  source: 'Manual'
                });
                setManualGroup(group.id);
              }}
              style={{
                ...styles.ageButton,
                ...(manualGroup === group.id ? styles.ageButtonActive : {})
              }}
            >
              <span style={styles.ageLabel}>{t(`ageGroups.${group.id}`)}</span>
              <span style={styles.ageSub}>{t(`ageGroups.${group.id}Sub`)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
