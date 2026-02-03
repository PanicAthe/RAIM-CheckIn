import { useState, useEffect } from 'react';
import { Settings, Users, Calendar, Save, X, Sliders, BarChart3, MapPin, ChevronDown } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';
import { RAIM_COLORS, ageGroups, roomLocations } from '../constants';

const getStyles = (device) => {
  const pick = (map) => map[device] ?? map.desktop;
  return {
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
      backdropFilter: 'blur(4px)',
      padding: pick({ mobile: '12px', tablet: '16px', tabletA9: '18px', desktop: '20px' }),
      boxSizing: 'border-box'
    },
    dashboardModal: {
      backgroundColor: 'white',
      borderRadius: pick({ mobile: '22px', tablet: '26px', tabletA9: '28px', desktop: '28px' }),
      padding: pick({ mobile: '26px', tablet: '34px', tabletA9: '38px', desktop: '40px' }),
      width: '100%',
      maxWidth: pick({ mobile: '980px', tablet: '1080px', tabletA9: '1100px', desktop: '1100px' }),
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
      marginBottom: pick({ mobile: '22px', tablet: '30px', tabletA9: '32px', desktop: '35px' }),
      paddingBottom: pick({ mobile: '16px', tablet: '20px', tabletA9: '22px', desktop: '25px' }),
      borderBottom: `3px solid ${RAIM_COLORS.BG}`
    },
    dashboardTitle: {
      margin: 0,
      fontSize: pick({ mobile: '26px', tablet: '32px', tabletA9: '34px', desktop: '36px' }),
      color: RAIM_COLORS.DARK,
      fontWeight: '800',
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    closeButton: {
      background: RAIM_COLORS.BG,
      border: 'none',
      cursor: 'pointer',
      color: RAIM_COLORS.MUTED,
      padding: pick({ mobile: '12px', tablet: '14px', tabletA9: '14px', desktop: '14px' }),
      borderRadius: '16px',
      transition: 'all 0.3s',
      fontSize: '18px',
      minWidth: pick({ mobile: '44px', tablet: '48px', tabletA9: '50px', desktop: '50px' }),
      minHeight: pick({ mobile: '44px', tablet: '48px', tabletA9: '50px', desktop: '50px' }),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: pick({ mobile: 'repeat(auto-fit, minmax(320px, 1fr))', tablet: 'repeat(auto-fit, minmax(420px, 1fr))', tabletA9: 'repeat(auto-fit, minmax(440px, 1fr))', desktop: 'repeat(auto-fit, minmax(450px, 1fr))' }),
      gap: pick({ mobile: '16px', tablet: '22px', tabletA9: '26px', desktop: '30px' }),
      marginBottom: pick({ mobile: '22px', tablet: '28px', tabletA9: '32px', desktop: '35px' })
    },
    section: {
      backgroundColor: '#FAFBFC',
      borderRadius: pick({ mobile: '16px', tablet: '18px', tabletA9: '20px', desktop: '20px' }),
      padding: pick({ mobile: '20px', tablet: '26px', tabletA9: '28px', desktop: '30px' }),
      border: `1px solid ${RAIM_COLORS.BG}`,
      transition: 'all 0.3s',
      borderTop: `4px solid ${RAIM_COLORS.DARK}`,
      boxSizing: 'border-box'
    },
    sectionTitle: {
      fontSize: pick({ mobile: '18px', tablet: '20px', tabletA9: '21px', desktop: '22px' }),
      color: RAIM_COLORS.DARK,
      fontWeight: '700',
      marginBottom: pick({ mobile: '18px', tablet: '22px', tabletA9: '24px', desktop: '25px' }),
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    statsCard: {
    background: `linear-gradient(135deg, ${RAIM_COLORS.DARK}, ${RAIM_COLORS.MEDIUM})`,
    borderRadius: '20px',
    padding: '40px 30px',
    textAlign: 'center',
    color: 'white',
    position: 'relative',
    overflow: 'hidden'
  },
  statsNumber: {
    fontSize: '68px',
    color: 'white',
    fontWeight: '800',
    margin: '20px 0',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    zIndex: 1
  },
  statsLabel: {
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    position: 'relative',
    zIndex: 1
  },
  formGroup: {
    marginBottom: '30px'
  },
  formLabel: {
    display: 'block',
    marginBottom: '12px',
    fontSize: '18px',
    fontWeight: '600',
    color: RAIM_COLORS.DARK
  },
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: pick({ mobile: '8px', tablet: '20px', tabletA9: '20px', desktop: '20px' }),
    padding: pick({ mobile: '12px', tablet: '20px', tabletA9: '20px', desktop: '20px' }),
    backgroundColor: 'white',
    borderRadius: '16px',
    border: `2px solid ${RAIM_COLORS.BG}`,
    boxSizing: 'border-box'
  },
  slider: {
    flex: 1,
    height: '10px',
    borderRadius: '5px',
    outline: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer'
  },
  sliderValue: {
    minWidth: pick({ mobile: '50px', tablet: '80px', tabletA9: '80px', desktop: '80px' }),
    textAlign: 'center',
    fontSize: pick({ mobile: '16px', tablet: '24px', tabletA9: '24px', desktop: '24px' }),
    fontWeight: '800',
    color: RAIM_COLORS.DARK,
    padding: pick({ mobile: '6px 10px', tablet: '10px 18px', tabletA9: '10px 18px', desktop: '10px 18px' }),
    backgroundColor: RAIM_COLORS.BG,
    borderRadius: '12px',
    flexShrink: 0
  },
  saveButton: {
    width: '100%',
    padding: '24px',
    background: `linear-gradient(135deg, ${RAIM_COLORS.DARK}, ${RAIM_COLORS.MEDIUM})`,
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    fontSize: '20px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    boxShadow: '0 8px 24px rgba(0, 68, 139, 0.3)',
    minHeight: '70px'
  },
  infoText: {
    fontSize: '15px',
    color: RAIM_COLORS.MUTED,
    marginTop: '12px',
    textAlign: 'center',
    lineHeight: '1.5'
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${RAIM_COLORS.DARK}15`,
    color: RAIM_COLORS.DARK
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    border: `1px solid ${RAIM_COLORS.BG}`
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: RAIM_COLORS.DARK,
    marginBottom: '18px',
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
  bar: {
    flex: 1,
    margin: '0 3px',
    borderRadius: '6px 6px 0 0',
    transition: 'all 0.3s',
    position: 'relative'
  },
  barLabel: {
    fontSize: pick({ mobile: '11px', tablet: '14px', tabletA9: '14px', desktop: '14px' }),
    color: RAIM_COLORS.MUTED,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: '1.2',
    maxWidth: '60px',
    wordBreak: 'break-word'
  },
  genderChart: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '20px 0'
  },
  genderBar: {
    width: '100px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '18px'
  },
  selectWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  select: {
    width: '100%',
    padding: '18px 18px 18px 52px',
    fontSize: '18px',
    border: `2px solid ${RAIM_COLORS.BG}`,
    borderRadius: '16px',
    outline: 'none',
    transition: 'border 0.2s',
    boxSizing: 'border-box',
    backgroundColor: 'white',
    cursor: 'pointer',
    minHeight: '58px',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none'
  },
  selectIcon: {
    position: 'absolute',
    right: '18px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    zIndex: 1
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
    padding: pick({ mobile: '12px', tablet: '14px', tabletA9: '16px', desktop: '18px' }),
    boxSizing: 'border-box'
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: pick({ mobile: '18px', tablet: '20px', tabletA9: '22px', desktop: '22px' }),
    padding: pick({ mobile: '24px', tablet: '28px', tabletA9: '30px', desktop: '32px' }),
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 18px 40px rgba(0, 68, 139, 0.25)',
    border: `1px solid ${RAIM_COLORS.BG}`,
    textAlign: 'center'
  },
  modalTitle: {
    margin: '0 0 10px 0',
    fontSize: pick({ mobile: '20px', tablet: '22px', tabletA9: '22px', desktop: '22px' }),
    fontWeight: '800',
    color: RAIM_COLORS.DARK
  },
  modalBody: {
    margin: '0 0 18px 0',
    fontSize: pick({ mobile: '15px', tablet: '16px', tabletA9: '16px', desktop: '16px' }),
    color: RAIM_COLORS.MUTED,
    lineHeight: 1.5
  },
  modalButtonRow: {
    display: 'flex',
    justifyContent: 'center'
  },
  modalButton: {
    padding: pick({ mobile: '12px 20px', tablet: '14px 24px', tabletA9: '14px 24px', desktop: '14px 24px' }),
    background: `linear-gradient(135deg, ${RAIM_COLORS.DARK}, ${RAIM_COLORS.MEDIUM})`,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: pick({ mobile: '16px', tablet: '17px', tabletA9: '17px', desktop: '17px' }),
    fontWeight: '700',
    cursor: 'pointer',
    minWidth: '120px',
    boxShadow: '0 6px 16px rgba(0, 68, 139, 0.25)'
  }
  };
};

export default function Dashboard({ onClose, onSave }) {
  const { device } = useIsMobile();
  const styles = getStyles(device);
  
  const [todayCount, setTodayCount] = useState(0);
  const [ageCorrection, setAgeCorrection] = useState(4);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
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
    const today = new Date();
    const todayStr = today.toDateString();
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith('visitorCount_') || key.startsWith('todayVisitors_')) {
        const dateStr = key.split('_').slice(1).join('_');
        
        if (dateStr !== todayStr) {
          localStorage.removeItem(key);
        }
      }
    });
    
    const savedData = localStorage.getItem(`visitorCount_${todayStr}`);
    if (savedData) {
      setTodayCount(parseInt(savedData, 10));
    }

    // 저장된 나이 보정값 로드
    const savedCorrection = localStorage.getItem('ageCorrection');
    if (savedCorrection) {
      setAgeCorrection(parseInt(savedCorrection, 10));
    }

    // 저장된 관람실 정보 로드
    const savedRoom = localStorage.getItem('room_location');
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
    localStorage.setItem('room_location', selectedRoom);

    setShowSaveModal(true);
  };

  const handleCloseSaveModal = () => {
    setShowSaveModal(false);
    onSave();
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
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '40px', 
          padding: '24px'
        }}>
          <div style={{ position: 'relative', width: '180px', height: '180px' }}>
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
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <div style={{ fontSize: '28px', fontWeight: '800', color: RAIM_COLORS.DARK }}>
                  {total}명
                </div>
                <div style={{ fontSize: '14px', color: RAIM_COLORS.MUTED }}>
                  Total
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: RAIM_COLORS.DARK,
                flexShrink: 0
              }} />
              <div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: RAIM_COLORS.DARK }}>
                  남성
                </div>
                <div style={{ fontSize: '15px', color: RAIM_COLORS.MUTED }}>
                  {visitorStats.gender.male}명 ({malePercent}%)
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: RAIM_COLORS.MEDIUM,
                flexShrink: 0
              }} />
              <div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: RAIM_COLORS.DARK }}>
                  여성
                </div>
                <div style={{ fontSize: '15px', color: RAIM_COLORS.MUTED }}>
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
            <Settings size={34} />
            관리자 대시보드
          </h2>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={28} />
          </button>
        </div>

        <div style={styles.gridContainer}>
          {/* 오늘의 입장객 수 */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <div style={styles.iconWrapper}>
                <Users size={24} />
              </div>
              오늘의 입장 현황
            </h3>
            <div style={styles.statsCard}>
              <Calendar size={42} color="rgba(255,255,255,0.8)" style={{ marginBottom: '18px' }} />
              <div style={styles.statsNumber}>{todayCount.toLocaleString()}</div>
              <div style={styles.statsLabel}>오늘의 누적 입장객 수</div>
            </div>
            <div style={styles.infoText}>
              오늘 등록된 모든 방문객 데이터는 Firebase에 저장됩니다.
            </div>
          </div>

          {/* 통계 그래프 */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <div style={styles.iconWrapper}>
                <BarChart3 size={24} />
              </div>
              오늘의 통계 분석
            </h3>
            <AgeGroupChart />
            <div style={{ marginTop: '20px' }}>
              <GenderChart />
            </div>
            <div style={styles.infoText}>
              오늘 등록된 방문객의 연령대와 성별 분포를 시각화합니다.
            </div>
          </div>
        </div>

        {/* 나이 보정값 조절 */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            <div style={styles.iconWrapper}>
              <Sliders size={24} />
            </div>
            설정
          </h3>
          
          {/* 관람실 선택 */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>관람실 선택</label>
            <div style={styles.selectWrapper}>
              <MapPin size={24} color={RAIM_COLORS.MUTED} style={{position:'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', zIndex: 1}} />
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
              <ChevronDown 
                size={24} 
                color={RAIM_COLORS.MUTED} 
                style={styles.selectIcon}
              />
            </div>
            <div style={styles.infoText}>
              데이터 저장 시 이 관람실 정보가 함께 저장됩니다.
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>나이 보정값 ({ageCorrection > 0 ? '+' : ''}{ageCorrection}세)</label>
            <div style={styles.sliderContainer}>
              <span style={{ fontSize: '15px', color: RAIM_COLORS.MUTED, minWidth: '30px' }}>-10</span>
              <input
                type="range"
                min="-10"
                max="10"
                value={ageCorrection}
                onChange={(e) => setAgeCorrection(parseInt(e.target.value, 10))}
                style={getSliderStyle()}
              />
              <span style={{ fontSize: '15px', color: RAIM_COLORS.MUTED, minWidth: '30px' }}>+10</span>
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
          <Save size={24} />
          설정 저장
        </button>
      </div>

      {showSaveModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={styles.modalTitle}>설정이 저장되었습니다</h3>
            <p style={styles.modalBody}>관람실과 나이 보정값 설정이 저장되었어요.</p>
            <div style={styles.modalButtonRow}>
              <button style={styles.modalButton} onClick={handleCloseSaveModal}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
