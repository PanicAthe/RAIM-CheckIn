import { UserPlus, ArrowDown } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';
import { ageGroups, RAIM_COLORS } from '../constants';

const getStyles = (isMobile) => ({
  manualCard: { 
    flex: 1, border: `1px solid ${RAIM_COLORS.BG}`, borderRadius: '16px', 
    padding: isMobile ? '10px' : '15px', background: '#FAFAFA', 
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', 
    overflow: 'hidden' 
  },
  cardHeaderRow: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    marginBottom: '8px', paddingBottom: '5px', 
    borderBottom: `2px solid ${RAIM_COLORS.BG}` 
  },
  cardTitleWrapper: { 
    display: 'flex', alignItems: 'center', gap: '6px' 
  },
  cardTitle: { 
    margin: 0, fontSize: isMobile ? '14px' : '16px', 
    color: RAIM_COLORS.DARK, fontWeight: '700' 
  },
  inputGroup: { 
    marginBottom: isMobile ? '5px' : '15px', flex: 1, 
    display: 'flex', flexDirection: 'column', justifyContent: 'center' 
  },
  inputLabel: { 
    display: 'block', marginBottom: '5px', fontSize: '12px', 
    fontWeight: '700', color: RAIM_COLORS.MUTED 
  },
  toggleButton: { 
    flex: 1, padding: isMobile ? '8px 0' : '12px', 
    fontSize: isMobile ? '12px' : '14px', 
    border: `1px solid ${RAIM_COLORS.MUTED}44`, borderRadius: '8px', 
    cursor: 'pointer', fontWeight: '600', backgroundColor: 'white', 
    color: RAIM_COLORS.MUTED, transition: 'all 0.2s', whiteSpace: 'nowrap' 
  },
  toggleButtonActive: { 
    backgroundColor: RAIM_COLORS.DARK, 
    border: `1px solid ${RAIM_COLORS.DARK}`, 
    color: 'white',
    boxShadow: '0 2px 8px rgba(0, 68, 139, 0.2)'
  },
  gridContainer: { 
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', 
    gap: isMobile ? '4px' : '8px' 
  },
  ageButton: { 
    padding: isMobile ? '6px 0' : '10px', 
    border: `1px solid ${RAIM_COLORS.MUTED}44`, borderRadius: '8px', 
    cursor: 'pointer', fontSize: isMobile ? '11px' : '13px', 
    fontWeight: '600', backgroundColor: 'white', color: RAIM_COLORS.MUTED, 
    whiteSpace: 'nowrap' 
  },
  ageButtonActive: { 
    backgroundColor: RAIM_COLORS.DARK, 
    border: `1px solid ${RAIM_COLORS.DARK}`, 
    color: 'white' 
  },
  addButton: { 
    width: '100%', display:'flex', alignItems:'center', 
    justifyContent:'center', gap:'4px', padding: isMobile ? '10px' : '14px', 
    fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold', 
    backgroundColor: 'white', color: RAIM_COLORS.MEDIUM, 
    border: `2px solid ${RAIM_COLORS.MEDIUM}`, borderRadius: '12px', 
    cursor: 'pointer' 
  }
});

export default function ManualEntryCard({ 
  manualGender, 
  setManualGender, 
  manualGroup, 
  setManualGroup, 
  onAdd 
}) {
  const isMobile = useIsMobile();
  const styles = getStyles(isMobile);

  return (
    <div style={styles.manualCard}>
      <div style={styles.cardHeaderRow}>
        <div style={styles.cardTitleWrapper}>
          <UserPlus size={isMobile ? 18 : 20} color={RAIM_COLORS.DARK} />
          <h3 style={styles.cardTitle}>수동 선택</h3>
        </div>
      </div>
      
      <div style={styles.inputGroup}>
        {!isMobile && <label style={styles.inputLabel}>성별</label>}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            style={{ 
              ...styles.toggleButton, 
              ...(manualGender === 'male' ? styles.toggleButtonActive : {}) 
            }}
            onClick={() => setManualGender('male')}
          >
            남성
          </button>
          <button 
            style={{ 
              ...styles.toggleButton, 
              ...(manualGender === 'female' ? styles.toggleButtonActive : {}) 
            }}
            onClick={() => setManualGender('female')}
          >
            여성
          </button>
        </div>
      </div>

      <div style={styles.inputGroup}>
        {!isMobile && <label style={styles.inputLabel}>연령대</label>}
        <div style={styles.gridContainer}>
          {ageGroups.map((group) => (
            <button
              key={group.label}
              onClick={() => setManualGroup(group.label)}
              style={{
                ...styles.ageButton,
                ...(manualGroup === group.label ? styles.ageButtonActive : {})
              }}
            >
              <span style={{display:'block', fontSize: isMobile ? '13px' : '14px'}}>
                {group.label}
              </span>
              <span style={{
                display:'block', 
                fontSize: '10px', 
                fontWeight:'normal', 
                opacity: 0.8
              }}>
                {group.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button onClick={onAdd} style={styles.addButton}>
        <span>추가하기</span>
        <ArrowDown size={16} strokeWidth={3} />
      </button>
    </div>
  );
}
