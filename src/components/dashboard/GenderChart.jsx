import { useIsMobile } from '../../hooks/useIsMobile';
import { RAIM_COLORS } from '../../constants';

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
    }
  };
};

export default function GenderChart({ visitorStats }) {
  const { device } = useIsMobile();
  const styles = getStyles(device);
  
  const total = visitorStats.gender.male + visitorStats.gender.female;
  const malePercent = total > 0 ? Math.round((visitorStats.gender.male / total) * 100) : 0;
  const femalePercent = total > 0 ? Math.round((visitorStats.gender.female / total) * 100) : 0;
  const maleDegree = total > 0 ? (visitorStats.gender.male / total) * 360 : 0;
  
  const isMobileDevice = device === 'mobile';
  const chartSize = isMobileDevice ? 140 : 180;
  const innerSize = isMobileDevice ? 100 : 130;
  const gap = isMobileDevice ? '20px' : '40px';
  const padding = isMobileDevice ? '16px' : '24px';
  
  return (
    <div style={styles.chartContainer}>
      <div style={styles.chartTitle}>성별 분포</div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: gap, 
        padding: padding,
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', width: `${chartSize}px`, height: `${chartSize}px`, flexShrink: 0 }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `conic-gradient(${RAIM_COLORS.DARK} 0deg ${maleDegree}deg, ${RAIM_COLORS.MEDIUM} ${maleDegree}deg 360deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: `${innerSize}px`,
                height: `${innerSize}px`,
                borderRadius: '50%',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}
            >
              <div style={{ fontSize: isMobileDevice ? '22px' : '28px', fontWeight: '800', color: RAIM_COLORS.DARK }}>
                {total}명
              </div>
              <div style={{ fontSize: isMobileDevice ? '12px' : '14px', color: RAIM_COLORS.MUTED }}>
                Total
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobileDevice ? '12px' : '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobileDevice ? '10px' : '15px' }}>
            <div style={{
              width: isMobileDevice ? '22px' : '28px',
              height: isMobileDevice ? '22px' : '28px',
              borderRadius: '6px',
              backgroundColor: RAIM_COLORS.DARK,
              flexShrink: 0
            }} />
            <div>
              <div style={{ fontSize: isMobileDevice ? '15px' : '18px', fontWeight: '600', color: RAIM_COLORS.DARK }}>
                남성
              </div>
              <div style={{ fontSize: isMobileDevice ? '13px' : '15px', color: RAIM_COLORS.MUTED }}>
                {visitorStats.gender.male}명 ({malePercent}%)
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobileDevice ? '10px' : '15px' }}>
            <div style={{
              width: isMobileDevice ? '22px' : '28px',
              height: isMobileDevice ? '22px' : '28px',
              borderRadius: '6px',
              backgroundColor: RAIM_COLORS.MEDIUM,
              flexShrink: 0
            }} />
            <div>
              <div style={{ fontSize: isMobileDevice ? '15px' : '18px', fontWeight: '600', color: RAIM_COLORS.DARK }}>
                여성
              </div>
              <div style={{ fontSize: isMobileDevice ? '13px' : '15px', color: RAIM_COLORS.MUTED }}>
                {visitorStats.gender.female}명 ({femalePercent}%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
