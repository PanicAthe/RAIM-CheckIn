import { useIsMobile } from '../../hooks/useIsMobile';
import { useTranslation } from 'react-i18next';
import { RAIM_COLORS, normalizeAgeGroupId } from '../../constants';

const getStyles = (device) => {
  const pick = (map) => map[device] ?? map.desktop;
  return {
    chartContainer: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: pick({ mobile: '16px', tablet: '24px', tabletA9: '24px', desktop: '24px' }),
      border: `1px solid ${RAIM_COLORS.BG}`,
      boxSizing: 'border-box',
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden'
    },
    chartTitle: {
      fontSize: pick({ mobile: '15px', tablet: '17px', tabletA9: '17px', desktop: '18px' }),
      fontWeight: '600',
      color: RAIM_COLORS.DARK,
      marginBottom: pick({ mobile: '14px', tablet: '16px', tabletA9: '16px', desktop: '18px' }),
      textAlign: 'center'
    },
    barChart: {
      width: '100%',
      height: '340px'
    },
    barGroup: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      height: '300px',
      marginBottom: '10px',
      overflow: 'visible',
      gap: pick({ mobile: '8px', tablet: '12px', tabletA9: '12px', desktop: '12px' })
    },
    barLabel: {
      fontSize: pick({ mobile: '11px', tablet: '14px', tabletA9: '14px', desktop: '14px' }),
      color: RAIM_COLORS.MUTED,
      textAlign: 'center',
      fontWeight: '500',
      lineHeight: '1.2',
      maxWidth: '60px',
      wordBreak: 'break-word'
    }
  };
};

export default function AgeGroupChart({ visitorStats }) {
  const { device } = useIsMobile();
  const { t } = useTranslation();
  const styles = getStyles(device);
  
  const totalCount = Object.values(visitorStats.ageGroups).reduce((sum, count) => sum + count, 0);
  
  if (totalCount === 0) {
    return (
      <div style={styles.chartContainer}>
        <div style={styles.chartTitle}>연령대 분포</div>
        <div style={{ padding: '40px 20px', textAlign: 'center', color: RAIM_COLORS.MUTED }}>
          데이터가 없습니다
        </div>
      </div>
    );
  }
  
  const actualAgeGroups = Object.keys(visitorStats.ageGroups).filter(key => visitorStats.ageGroups[key] > 0);
  const maxCount = Math.max(...Object.values(visitorStats.ageGroups), 1);
  
  return (
    <div style={styles.chartContainer}>
      <div style={styles.chartTitle}>연령대 분포</div>
      <div style={styles.barChart}>
        <div style={styles.barGroup}>
          {actualAgeGroups.map((ageGroup) => {
            const count = visitorStats.ageGroups[ageGroup];
            const genderData = visitorStats.ageGroupGender?.[ageGroup] || { male: 0, female: 0 };
            const height = maxCount > 0 ? (count / maxCount) * 200 : 0;
            
            return (
              <div key={ageGroup} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: '8px' }}>
                {count > 0 && (
                  <div style={{ fontSize: '14px', fontWeight: '700', color: RAIM_COLORS.DARK }}>
                    {count}
                  </div>
                )}
                <div 
                  style={{
                    height: `${height}px`,
                    width: '70%',
                    backgroundColor: RAIM_COLORS.DARK,
                    borderRadius: '4px 4px 0 0',
                    minHeight: count > 0 ? '8px' : '0',
                    transition: 'all 0.3s',
                    boxShadow: count > 0 ? '0 4px 12px rgba(0, 68, 139, 0.2)' : 'none'
                  }}
                />
                <div style={styles.barLabel}>{t(`ageGroups.${ageGroup}`)}</div>
                {count > 0 && (
                  <div style={{ fontSize: '11px', color: RAIM_COLORS.MUTED, textAlign: 'center', lineHeight: '1.3' }}>
                    남 {genderData.male} / 여 {genderData.female}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
