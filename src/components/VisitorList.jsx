import { ClipboardList, User, X } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';
import { RAIM_COLORS } from '../constants';

const getStyles = (isMobile) => ({
  listCard: { 
    border: `1px solid ${RAIM_COLORS.BG}`, borderRadius: '16px', 
    padding: isMobile ? '10px' : '15px', background: '#fff', 
    display: 'flex', flexDirection: 'column', 
    height: isMobile ? '200px' : 'auto' 
  },
  cardHeaderRow: { 
    display: 'flex', justifyContent: 'space-between', 
    alignItems: 'center', marginBottom: '8px', paddingBottom: '5px', 
    borderBottom: `2px solid ${RAIM_COLORS.BG}` 
  },
  cardTitleWrapper: { 
    display: 'flex', alignItems: 'center', gap: '6px' 
  },
  cardTitle: { 
    margin: 0, fontSize: isMobile ? '14px' : '16px', 
    color: RAIM_COLORS.DARK, fontWeight: '700' 
  },
  countBadge: { 
    backgroundColor: RAIM_COLORS.MEDIUM, color: 'white', 
    padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold', 
    fontSize: '12px' 
  },
  listContainer: { 
    flex: 1, overflowY: 'auto', paddingRight: '4px' 
  },
  emptyState: { 
    height: '100%', display: 'flex', flexDirection: 'column', 
    justifyContent: 'center', alignItems: 'center', 
    color: RAIM_COLORS.MUTED 
  },
  listItem: { 
    display: 'flex', alignItems: 'center', padding: '8px', 
    background: 'white', marginBottom: '6px', borderRadius: '8px', 
    border: `1px solid ${RAIM_COLORS.BG}` 
  },
  avatar: { 
    width: '30px', height: '30px', borderRadius: '50%', 
    display: 'flex', justifyContent: 'center', alignItems: 'center', 
    flexShrink: 0, backgroundColor: RAIM_COLORS.BG, 
    color: RAIM_COLORS.DARK 
  },
  listItemTitle: { 
    fontWeight: '700', fontSize: '14px', color: RAIM_COLORS.DARK, 
    marginBottom: '2px' 
  },
  badgeContainer: { 
    display: 'flex', gap: '4px' 
  },
  badgeNeutral: { 
    display:'inline-flex', alignItems:'center', justifyContent:'center', 
    fontSize: '10px', padding: '2px 6px', borderRadius: '4px', 
    backgroundColor: RAIM_COLORS.GRAY_BG, color: RAIM_COLORS.GRAY_TXT, 
    fontWeight: '700', whiteSpace: 'nowrap', flexShrink: 0 
  },
  badgeAI: { 
    display:'inline-flex', alignItems:'center', justifyContent:'center', 
    fontSize: '10px', padding: '2px 4px', borderRadius: '4px', 
    backgroundColor: RAIM_COLORS.TEAL + '22', color: '#0F766E', 
    fontWeight: '700', border: `1px solid ${RAIM_COLORS.TEAL}44`, 
    whiteSpace: 'nowrap', flexShrink: 0 
  },
  badgeManual: { 
    display:'inline-flex', alignItems:'center', justifyContent:'center', 
    fontSize: '10px', padding: '2px 4px', borderRadius: '4px', 
    backgroundColor: '#F3F4F6', color: '#4B5563', fontWeight: '700', 
    border: '1px solid #E5E7EB', whiteSpace: 'nowrap', flexShrink: 0 
  },
  deleteButton: { 
    display: 'flex', alignItems:'center', justifyContent:'center', 
    padding: '6px', border: 'none', background: '#F3F4F6', 
    borderRadius: '6px', cursor: 'pointer', marginLeft: 'auto', 
    flexShrink: 0 
  }
});

export default function VisitorList({ visitors, onRemove }) {
  const isMobile = useIsMobile();
  const styles = getStyles(isMobile);

  return (
    <div style={styles.listCard}>
      <div style={styles.cardHeaderRow}>
        <div style={styles.cardTitleWrapper}>
          <ClipboardList size={isMobile ? 18 : 20} color={RAIM_COLORS.DARK} />
          <h3 style={styles.cardTitle}>등록 명단</h3>
        </div>
        <span style={styles.countBadge}>{visitors.length}명</span>
      </div>
      
      <div style={styles.listContainer}>
        {visitors.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={{fontSize:'13px'}}>명단이 없습니다.</span>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {visitors.map((v) => (
              <li key={v.id} style={styles.listItem}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                  <div style={styles.avatar}>
                    <User size={18} strokeWidth={2.5} />
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={styles.listItemTitle}>{v.ageGroup}</div>
                    <div style={styles.badgeContainer}>
                      <span style={styles.badgeNeutral}>
                        {v.gender === 'male' ? '남성' : '여성'}
                      </span>
                      <span style={v.source === 'AI' ? styles.badgeAI : styles.badgeManual}>
                        {v.source === 'AI' ? 'AI' : '수동'}
                      </span>
                    </div>
                  </div>

                  <button onClick={() => onRemove(v.id)} style={styles.deleteButton}>
                    <X size={16} color={RAIM_COLORS.MUTED} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
