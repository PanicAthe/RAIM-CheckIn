import { useMemo } from 'react';
import { ClipboardList, User, X, Plus, Minus, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../hooks/useIsMobile';
import { RAIM_COLORS, AGE_GROUP_LABEL_TO_ID, normalizeAgeGroupId } from '../constants';
import { generateUniqueId } from '../utils/idGenerator';

const getStyles = (device) => {
  const pick = (map) => map[device] ?? map.desktop;
  const radius = pick({ mobile: '16px', tabletA9: '20px', desktop: '20px' });

  return {
    listCard: { 
      border: `1px solid ${RAIM_COLORS.BG}`, borderRadius: radius, 
      padding: pick({ mobile: '10px', tabletA9: '15px', desktop: '16px' }), background: 'linear-gradient(180deg, #FFFFFF 0%, #F7FBFF 100%)', 
      display: 'flex', flexDirection: 'column', 
      height: pick({ mobile: '180px', tabletA9: '240px', desktop: '260px' }),
      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.08)'
    },
    cardHeaderRow: { 
      display: 'flex', justifyContent: 'space-between', 
      alignItems: 'center', marginBottom: pick({ mobile: '8px', tabletA9: '10px', desktop: '10px' }), paddingBottom: '8px', 
      borderBottom: `2px solid ${RAIM_COLORS.BG}` 
    },
    cardTitleWrapper: { 
      display: 'flex', alignItems: 'center', gap: pick({ mobile: '8px', tabletA9: '10px', desktop: '10px' }) 
    },
    cardTitle: { 
      margin: 0, fontSize: pick({ mobile: '15px', tabletA9: '26px', desktop: '28px' }), 
      color: RAIM_COLORS.DARK, fontWeight: '700' 
    },
    countBadge: { 
      backgroundColor: RAIM_COLORS.MEDIUM, color: 'white', 
      padding: pick({ mobile: '3px 10px', tabletA9: '4px 12px', desktop: '4px 12px' }), borderRadius: '16px', fontWeight: 'bold', 
      fontSize: pick({ mobile: '15px', tabletA9: '22px', desktop: '24px' })
    },
    resetButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      padding: pick({ mobile: '6px 12px', tabletA9: '8px 14px', desktop: '8px 14px' }),
      backgroundColor: '#F3F4F6',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: pick({ mobile: '13px', tabletA9: '16px', desktop: '16px' }),
      fontWeight: '600',
      color: RAIM_COLORS.MUTED,
      transition: 'all 0.2s',
      marginRight: '10px'
    },
    listContainer: { 
      flex: 1, overflowY: 'auto', paddingRight: '6px' 
    },
    emptyState: { 
      height: '100%', display: 'flex', flexDirection: 'column', 
      justifyContent: 'center', alignItems: 'center', 
      color: RAIM_COLORS.MUTED 
    },
    listItem: { 
      display: 'flex', alignItems: 'center', padding: pick({ mobile: '10px', tabletA9: '12px', desktop: '12px' }), 
      background: 'white', marginBottom: '8px', borderRadius: '12px', 
      border: `1px solid ${RAIM_COLORS.DARK}`,
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)'
    },
    avatar: { 
      width: pick({ mobile: '42px', tabletA9: '46px', desktop: '46px' }), height: pick({ mobile: '42px', tabletA9: '46px', desktop: '46px' }), borderRadius: '50%', 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      flexShrink: 0, backgroundColor: RAIM_COLORS.BG, 
      color: RAIM_COLORS.DARK,
      fontSize: pick({ mobile: '15px', tabletA9: '18px', desktop: '18px' }),
      fontWeight: '700'
    },
    listItemTitle: { 
      fontWeight: '700', fontSize: pick({ mobile: '15px', tabletA9: '24px', desktop: '26px' }), color: RAIM_COLORS.DARK, 
      marginBottom: '4px'
    },
    badgeContainer: { 
      display: 'flex', gap: '6px' 
    },
    badgeNeutral: { 
      display:'inline-flex', alignItems:'center', justifyContent:'center', 
      fontSize: pick({ mobile: '15px', tabletA9: '20px', desktop: '22px' }), padding: '3px 8px', borderRadius: '6px', 
      backgroundColor: RAIM_COLORS.GRAY_BG, color: RAIM_COLORS.GRAY_TXT, 
      fontWeight: '700', whiteSpace: 'nowrap', flexShrink: 0 
    },
    badgeAI: { 
      display:'inline-flex', alignItems:'center', justifyContent:'center', 
      fontSize: pick({ mobile: '15px', tabletA9: '20px', desktop: '22px' }), padding: '3px 8px', borderRadius: '6px', 
      backgroundColor: RAIM_COLORS.TEAL + '22', color: '#0F766E', 
      fontWeight: '700', border: `1px solid ${RAIM_COLORS.TEAL}44`, 
      whiteSpace: 'nowrap', flexShrink: 0 
    },
    badgeManual: { 
      display:'inline-flex', alignItems:'center', justifyContent:'center', 
      fontSize: pick({ mobile: '15px', tabletA9: '20px', desktop: '22px' }), padding: '3px 8px', borderRadius: '6px', 
      backgroundColor: '#F3F4F6', color: '#4B5563', fontWeight: '700', 
      border: '1px solid #E5E7EB', whiteSpace: 'nowrap', flexShrink: 0 
    },
    deleteButton: { 
      display: 'flex', alignItems:'center', justifyContent:'center', 
      padding: '10px', border: 'none', background: '#F3F4F6', 
      borderRadius: '10px', cursor: 'pointer', marginLeft: 'auto', 
      flexShrink: 0,
      minWidth: '42px',
      minHeight: '42px'
    },
    quantityControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginLeft: 'auto'
    },
    quantityButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: pick({ mobile: '15px', tabletA9: '20px', desktop: '22px' }),
      fontWeight: 'bold'
    },
    quantityButtonPlus: {
      backgroundColor: RAIM_COLORS.MEDIUM,
      color: 'white'
    },
    quantityButtonMinus: {
      backgroundColor: '#F3F4F6',
      color: RAIM_COLORS.MUTED
    },
    quantityText: {
      fontSize: pick({ mobile: '15px', tabletA9: '26px', desktop: '28px' }),
      fontWeight: '600',
      color: RAIM_COLORS.DARK,
      minWidth: pick({ mobile: '24px', tabletA9: '28px', desktop: '30px' }),
      textAlign: 'center'
    }
  };
};

export default function VisitorList({ visitors, onRemove, onAdd, onReset }) {
  const { t } = useTranslation();
  const { device } = useIsMobile();
  const styles = getStyles(device);

  // 방문객을 그룹화하여 수량 계산 (메모이제이션으로 성능 최적화)
  const groupedVisitors = useMemo(() => {
    return visitors.reduce((acc, visitor) => {
      const key = `${visitor.ageGroup}-${visitor.gender}-${visitor.source}`;
      if (!acc[key]) {
        acc[key] = {
          ...visitor,
          count: 0,
          ids: []
        };
      }
      acc[key].count++;
      acc[key].ids.push(visitor.id);
      return acc;
    }, {});
  }, [visitors]);

  const handleQuantityChange = (groupedVisitor, delta) => {
    const newCount = groupedVisitor.count + delta;
    if (newCount <= 0) {
      groupedVisitor.ids.forEach(id => onRemove(id));
    } else if (delta > 0) {
      const newVisitor = {
        id: generateUniqueId(),
        ageGroup: groupedVisitor.ageGroup,
        gender: groupedVisitor.gender,
        source: groupedVisitor.source
      };
      onAdd(newVisitor);
    } else {
      onRemove(groupedVisitor.ids[groupedVisitor.ids.length - 1]);
    }
  };

  return (
    <div style={styles.listCard}>
      <div style={styles.cardHeaderRow}>
        <div style={styles.cardTitleWrapper}>
          <ClipboardList size={30} color={RAIM_COLORS.DARK} />
          <h3 style={styles.cardTitle}>{t('visitorList.title')}</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {visitors.length > 0 && (
            <button 
              onClick={onReset}
              style={styles.resetButton}
            >
              <RotateCcw size={16} />
              {t('visitorList.resetButton')}
            </button>
          )}
          <span style={styles.countBadge}>{t('common.peopleCount', { count: visitors.length })}</span>
        </div>
      </div>
      
      <div style={styles.listContainer}>
        {visitors.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={{fontSize:'22px'}}>{t('visitorList.emptyState')}</span>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {Object.entries(groupedVisitors).map(([key, groupedVisitor]) => (
              <li key={key} style={styles.listItem}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                  <div style={styles.avatar}>
                    <User size={28} strokeWidth={2.5} />
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={styles.listItemTitle}>
                      {t(`ageGroups.${groupedVisitor.ageGroup}`)}
                      {groupedVisitor.count > 1 && (
                        <span style={{ 
                          fontSize: device === 'mobile' ? '12px' : device === 'tabletA9' ? '18px' : '20px', 
                          color: RAIM_COLORS.MEDIUM, 
                          fontWeight: '600',
                          marginLeft: '6px'
                        }}>
                          ({t('common.peopleCount', { count: groupedVisitor.count })})
                        </span>
                      )}
                    </div>
                    <div style={styles.badgeContainer}>
                      <span style={styles.badgeNeutral}>
                        {groupedVisitor.gender === 'male' ? t('common.male') : t('common.female')}
                      </span>
                      <span style={groupedVisitor.source === 'AI' ? styles.badgeAI : styles.badgeManual}>
                        {groupedVisitor.source === 'AI' ? t('visitorList.aiTag') : t('visitorList.manualTag')}
                      </span>
                    </div>
                  </div>

                  {groupedVisitor.count > 1 ? (
                    <div style={styles.quantityControls}>
                      <button
                        onClick={() => handleQuantityChange(groupedVisitor, -1)}
                        style={{
                          ...styles.quantityButton,
                          ...styles.quantityButtonMinus
                        }}
                      >
                        <Minus size={24} strokeWidth={2} />
                      </button>
                      <span style={styles.quantityText}>{groupedVisitor.count}</span>
                      <button
                        onClick={() => handleQuantityChange(groupedVisitor, 1)}
                        style={{
                          ...styles.quantityButton,
                          ...styles.quantityButtonPlus
                        }}
                      >
                        <Plus size={24} strokeWidth={2} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => onRemove(groupedVisitor.ids[0])} style={styles.deleteButton}>
                      <X size={28} color={RAIM_COLORS.MUTED} />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
