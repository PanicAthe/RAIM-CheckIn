import { useState, useEffect } from 'react';
import { Settings, Users, Calendar, Save, X, Sliders, BarChart3, MapPin } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';
import { RAIM_COLORS, ageGroups, roomLocations } from '../constants';

const getStyles = (isMobile) => ({
  dashboardOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)'
  },
  dashboardModal: {
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: isMobile ? '16px' : '32px',
    width: isMobile ? '92%' : '700px',
    maxWidth: '92%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 25px 50px rgba(0, 68, 139, 0.25)',
    border: `1px solid ${RAIM_COLORS.BG}`,
    boxSizing: 'border-box'
  },
  dashboardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isMobile ? '20px' : '30px',
    paddingBottom: isMobile ? '15px' : '20px',
    borderBottom: `3px solid ${RAIM_COLORS.BG}`
  },
  dashboardTitle: {
    margin: 0,
    fontSize: isMobile ? '22px' : '28px',
    color: RAIM_COLORS.DARK,
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  closeButton: {
    background: RAIM_COLORS.BG,
    border: 'none',
    cursor: 'pointer',
    color: RAIM_COLORS.MUTED,
    padding: '10px',
    borderRadius: '12px',
    transition: 'all 0.3s',
    fontSize: '18px'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: isMobile ? '16px' : '24px',
    marginBottom: isMobile ? '20px' : '30px'
  },
  section: {
    backgroundColor: '#FAFBFC',
    borderRadius: '16px',
    padding: isMobile ? '16px' : '24px',
    border: `1px solid ${RAIM_COLORS.BG}`,
    transition: 'all 0.3s',
    borderTop: `4px solid ${RAIM_COLORS.DARK}`,
    boxSizing: 'border-box'
  },
  sectionTitle: {
    fontSize: isMobile ? '16px' : '18px',
    color: RAIM_COLORS.DARK,
    fontWeight: '700',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  statsCard: {
    background: `linear-gradient(135deg, ${RAIM_COLORS.DARK}, ${RAIM_COLORS.MEDIUM})`,
    borderRadius: '16px',
    padding: '30px 20px',
    textAlign: 'center',
    color: 'white',
    position: 'relative',
    overflow: 'hidden'
  },
  statsNumber: {
    fontSize: isMobile ? '42px' : '56px',
    color: 'white',
    fontWeight: '800',
    margin: '15px 0',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    zIndex: 1
  },
  statsLabel: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    position: 'relative',
    zIndex: 1
  },
  formGroup: {
    marginBottom: '24px'
  },
  formLabel: {
    display: 'block',
    marginBottom: '10px',
    fontSize: '14px',
    fontWeight: '600',
    color: RAIM_COLORS.DARK
  },
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '10px' : '16px',
    padding: isMobile ? '12px' : '16px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: `2px solid ${RAIM_COLORS.BG}`,
    boxSizing: 'border-box'
  },
  slider: {
    flex: 1,
    height: '8px',
    borderRadius: '4px',
    outline: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer'
  },
  sliderValue: {
    minWidth: isMobile ? '50px' : '60px',
    textAlign: 'center',
    fontSize: isMobile ? '16px' : '18px',
    fontWeight: '800',
    color: RAIM_COLORS.DARK,
    padding: isMobile ? '6px 8px' : '8px 12px',
    backgroundColor: RAIM_COLORS.BG,
    borderRadius: '8px',
    flexShrink: 0
  },
  saveButton: {
    width: '100%',
    padding: '18px',
    background: `linear-gradient(135deg, ${RAIM_COLORS.DARK}, ${RAIM_COLORS.MEDIUM})`,
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 8px 24px rgba(0, 68, 139, 0.3)'
  },
  infoText: {
    fontSize: '12px',
    color: RAIM_COLORS.MUTED,
    marginTop: '8px',
    textAlign: 'center'
  },
  iconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${RAIM_COLORS.DARK}15`,
    color: RAIM_COLORS.DARK
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '16px',
    border: `1px solid ${RAIM_COLORS.BG}`
  },
  chartTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: RAIM_COLORS.DARK,
    marginBottom: '12px',
    textAlign: 'center'
  },
  barChart: {
    width: '100%',
    height: isMobile ? '200px' : '280px'
  },
  barGroup: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: isMobile ? '160px' : '240px',
    marginBottom: '8px',
    overflow: 'hidden'
  },
  bar: {
    flex: 1,
    margin: '0 2px',
    borderRadius: '4px 4px 0 0',
    transition: 'all 0.3s',
    position: 'relative'
  },
  barLabel: {
    fontSize: '10px',
    color: RAIM_COLORS.MUTED,
    textAlign: 'center'
  },
  genderChart: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '16px 0'
  },
  genderBar: {
    width: '80px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px'
  },
  selectWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  select: {
    width: '100%',
    padding: '15px 15px 15px 45px',
    fontSize: '16px',
    border: `2px solid ${RAIM_COLORS.BG}`,
    borderRadius: '12px',
    outline: 'none',
    transition: 'border 0.2s',
    boxSizing: 'border-box',
    backgroundColor: 'white',
    cursor: 'pointer'
  }
});

export default function Dashboard({ onClose, onSave }) {
  const isMobile = useIsMobile();
  const styles = getStyles(isMobile);
  
  const [todayCount, setTodayCount] = useState(0);
  const [ageCorrection, setAgeCorrection] = useState(4);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [visitorStats, setVisitorStats] = useState({
    ageGroups: {},
    gender: { male: 0, female: 0 }
  });

  // 오늘의 방문객 데이터 분석
  const analyzeVisitorData = () => {
    const today = new Date().toDateString();
    const todayDataKey = `todayVisitors_${today}`;
    const savedVisitors = localStorage.getItem(todayDataKey);
    
    if (savedVisitors) {
      const visitors = JSON.parse(savedVisitors);
      const ageGroupCount = {};
      const genderCount = { male: 0, female: 0 };
      
      visitors.forEach(visitor => {
        // 연령대 집계
        ageGroupCount[visitor.ageGroup] = (ageGroupCount[visitor.ageGroup] || 0) + 1;
        
        // 성별 집계
        if (visitor.gender === 'male') {
          genderCount.male++;
        } else if (visitor.gender === 'female') {
          genderCount.female++;
        }
      });
      
      setVisitorStats({
        ageGroups: ageGroupCount,
        gender: genderCount
      });
    }
  };

  useEffect(() => {
    // 모든 과거 데이터 정리 (오늘 데이터만 남기기)
    const today = new Date().toDateString();
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if ((key.startsWith('visitorCount_') || key.startsWith('todayVisitors_')) && !key.includes(today)) {
        localStorage.removeItem(key);
      }
    });
    
    // 오늘의 입장객 수 로드
    const savedData = localStorage.getItem(`visitorCount_${today}`);
    if (savedData) {
      setTodayCount(parseInt(savedData, 10));
    }

    // 저장된 나이 보정값 로드
    const savedCorrection = localStorage.getItem('ageCorrection');
    if (savedCorrection) {
      setAgeCorrection(parseInt(savedCorrection, 10));
    }

    // 저장된 관람실 정보 로드
    const savedRoom = localStorage.getItem('room_id');
    if (savedRoom) {
      setSelectedRoom(savedRoom);
    }

    // 방문객 데이터 분석
    analyzeVisitorData();
  }, []);

  const handleSave = () => {
    if (!selectedRoom) {
      alert("관람실을 선택해주세요.");
      return;
    }
    
    // 나이 보정값 저장
    localStorage.setItem('ageCorrection', ageCorrection.toString());
    
    // 관람실 정보 저장
    localStorage.setItem('room_id', selectedRoom);
    
    onSave();
    alert('설정이 저장되었습니다.');
  };

  const getSliderStyle = () => ({
    ...styles.slider,
    background: `linear-gradient(to right, ${RAIM_COLORS.DARK} 0%, ${RAIM_COLORS.DARK} ${((ageCorrection + 10) / 20) * 100}%, ${RAIM_COLORS.BG} ${((ageCorrection + 10) / 20) * 100}%, ${RAIM_COLORS.BG} 100%)`
  });

  // 연령대 그래프 컴포넌트
  const AgeGroupChart = () => {
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
    
    const maxCount = Math.max(...Object.values(visitorStats.ageGroups), 1);
    
    return (
      <div style={styles.chartContainer}>
        <div style={styles.chartTitle}>연령대 분포</div>
        <div style={styles.barChart}>
          <div style={styles.barGroup}>
            {ageGroups.map((group) => {
              const count = visitorStats.ageGroups[group.label] || 0;
              const height = maxCount > 0 ? (count / maxCount) * 200 : 0;
              
              return (
                <div key={group.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: '8px' }}>
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
                  <div style={styles.barLabel}>{group.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 성별 그래프 컴포넌트
  const GenderChart = () => {
    const total = visitorStats.gender.male + visitorStats.gender.female;
    const malePercent = total > 0 ? Math.round((visitorStats.gender.male / total) * 100) : 0;
    const femalePercent = total > 0 ? Math.round((visitorStats.gender.female / total) * 100) : 0;
    const maleDegree = total > 0 ? (visitorStats.gender.male / total) * 360 : 0;
    
    return (
      <div style={styles.chartContainer}>
        <div style={styles.chartTitle}>성별 분포</div>
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: isMobile ? '20px' : '40px', 
          padding: isMobile ? '16px' : '20px'
        }}>
          <div style={{ position: 'relative', width: isMobile ? '120px' : '140px', height: isMobile ? '120px' : '140px' }}>
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
                  width: isMobile ? '85px' : '100px',
                  height: isMobile ? '85px' : '100px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <div style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: '800', color: RAIM_COLORS.DARK }}>
                  {total}명
                </div>
                <div style={{ fontSize: isMobile ? '10px' : '11px', color: RAIM_COLORS.MUTED }}>
                  Total
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                backgroundColor: RAIM_COLORS.DARK,
                flexShrink: 0
              }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: RAIM_COLORS.DARK }}>
                  남성
                </div>
                <div style={{ fontSize: '12px', color: RAIM_COLORS.MUTED }}>
                  {visitorStats.gender.male}명 ({malePercent}%)
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                backgroundColor: RAIM_COLORS.MEDIUM,
                flexShrink: 0
              }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: RAIM_COLORS.DARK }}>
                  여성
                </div>
                <div style={{ fontSize: '12px', color: RAIM_COLORS.MUTED }}>
                  {visitorStats.gender.female}명 ({femalePercent}%)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.dashboardOverlay}>
      <div style={styles.dashboardModal}>
        <div style={styles.dashboardHeader}>
          <h2 style={styles.dashboardTitle}>
            <Settings size={isMobile ? 24 : 28} />
            관리자 대시보드
          </h2>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={isMobile ? 20 : 24} />
          </button>
        </div>

        <div style={styles.gridContainer}>
          {/* 오늘의 입장객 수 */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <div style={styles.iconWrapper}>
                <Users size={20} />
              </div>
              오늘의 입장 현황
            </h3>
            <div style={styles.statsCard}>
              <Calendar size={32} color="rgba(255,255,255,0.8)" style={{ marginBottom: '15px' }} />
              <div style={styles.statsNumber}>{todayCount.toLocaleString()}</div>
              <div style={styles.statsLabel}>오늘의 누적 입장객 수</div>
            </div>
            <div style={styles.infoText}>
              현재 브라우저에 저장된 오늘의 데이터입니다. 전체 통계는 Google Sheets에 적재됩니다.  
            </div>
          </div>

          {/* 통계 그래프 */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <div style={styles.iconWrapper}>
                <BarChart3 size={20} />
              </div>
              오늘의 통계 분석
            </h3>
            <AgeGroupChart />
            <div style={{ marginTop: '16px' }}>
              <GenderChart />
            </div>
            <div style={styles.infoText}>
              오늘 등록된 방문객의 연령대와 성별 분포입니다.
            </div>
          </div>
        </div>

        {/* 나이 보정값 조절 */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            <div style={styles.iconWrapper}>
              <Sliders size={20} />
            </div>
            설정
          </h3>
          
          {/* 관람실 선택 */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>관람실 선택</label>
            <div style={styles.selectWrapper}>
              <MapPin size={20} color={RAIM_COLORS.MUTED} style={{position:'absolute', left:'15px', zIndex: 1}} />
              <select 
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                style={styles.select}
              >
                <option value="">관람실 선택</option>
                {roomLocations.map(room => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* 나이 보정값 */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>나이 보정값 ({ageCorrection > 0 ? '+' : ''}{ageCorrection}세)</label>
            <div style={styles.sliderContainer}>
              <span style={{ fontSize: '12px', color: RAIM_COLORS.MUTED, minWidth: '25px' }}>-10</span>
              <input
                type="range"
                min="-10"
                max="10"
                value={ageCorrection}
                onChange={(e) => setAgeCorrection(parseInt(e.target.value, 10))}
                style={getSliderStyle()}
              />
              <span style={{ fontSize: '12px', color: RAIM_COLORS.MUTED, minWidth: '25px' }}>+10</span>
              <div style={styles.sliderValue}>
                {ageCorrection > 0 ? '+' : ''}{ageCorrection}
              </div>
            </div>
            <div style={styles.infoText}>
              AI가 인식한 나이에 보정값을 더하여 연령대를 계산합니다. 현장 상황에 맞게 조절하세요.
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <button 
          style={styles.saveButton}
          onClick={handleSave}
        >
          <Save size={18} />
          설정 저장
        </button>
      </div>
    </div>
  );
}
