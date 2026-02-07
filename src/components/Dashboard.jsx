import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Settings, Calendar, Save, X, Sliders, BarChart3, MapPin, ChevronDown, Edit3 } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';
import { RAIM_COLORS, ROOM_CACHE_KEY, AGE_GROUP_LABEL_TO_ID, normalizeAgeGroupId } from '../constants';
import { getRoomLocations, addRoomLocation, deleteRoomLocation } from '../firebase';
import AgeGroupChart from './dashboard/AgeGroupChart';
import GenderChart from './dashboard/GenderChart';
import BackupSection from './dashboard/BackupSection';
import RoomManagementModal from './dashboard/RoomManagementModal';

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
      fontSize: pick({ mobile: '22px', tablet: '32px', tabletA9: '34px', desktop: '36px' }),
      color: RAIM_COLORS.DARK,
      fontWeight: '800',
      display: 'flex',
      alignItems: 'center',
      gap: pick({ mobile: '12px', tablet: '15px', tabletA9: '15px', desktop: '15px' })
    },
    closeButton: {
      background: RAIM_COLORS.BG,
      border: 'none',
      cursor: 'pointer',
      color: RAIM_COLORS.MUTED,
      padding: pick({ mobile: '12px', tablet: '14px', tabletA9: '14px', desktop: '14px' }),
      borderRadius: pick({ mobile: '12px', tablet: '16px', tabletA9: '16px', desktop: '16px' }),
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
      gridTemplateColumns: pick({ mobile: '1fr', tablet: 'repeat(auto-fit, minmax(420px, 1fr))', tabletA9: 'repeat(auto-fit, minmax(440px, 1fr))', desktop: 'repeat(auto-fit, minmax(450px, 1fr))' }),
      gap: pick({ mobile: '18px', tablet: '22px', tabletA9: '26px', desktop: '30px' }),
      marginBottom: pick({ mobile: '22px', tablet: '28px', tabletA9: '32px', desktop: '35px' })
    },
    section: {
      backgroundColor: '#FAFBFC',
      borderRadius: pick({ mobile: '16px', tablet: '18px', tabletA9: '20px', desktop: '20px' }),
      padding: pick({ mobile: '20px', tablet: '26px', tabletA9: '28px', desktop: '30px' }),
      border: `1px solid ${RAIM_COLORS.BG}`,
      transition: 'all 0.3s',
      borderTop: `4px solid ${RAIM_COLORS.DARK}`,
      boxSizing: 'border-box',
      width: '100%',
      maxWidth: '100%'
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
    borderRadius: pick({ mobile: '14px', tablet: '16px', tabletA9: '16px', desktop: '16px' }),
    padding: pick({ mobile: '20px', tablet: '28px', tabletA9: '30px', desktop: '30px' }),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0, 68, 139, 0.2)',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '100%'
  },
  statsContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  statsNumber: {
    fontSize: pick({ mobile: '32px', tablet: '42px', tabletA9: '44px', desktop: '46px' }),
    color: 'white',
    fontWeight: '800',
    margin: 0,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    zIndex: 1,
    lineHeight: 1.2
  },
  statsLabel: {
    fontSize: pick({ mobile: '12px', tablet: '15px', tabletA9: '15px', desktop: '15px' }),
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    position: 'relative',
    zIndex: 1,
    lineHeight: 1.3
  },
  statsIcon: {
    opacity: 0.15,
    position: 'absolute',
    right: pick({ mobile: '15px', tablet: '20px', tabletA9: '20px', desktop: '20px' }),
    top: '50%',
    transform: 'translateY(-50%)'
  },
  formGroup: {
    marginBottom: pick({ mobile: '20px', tablet: '28px', tabletA9: '28px', desktop: '30px' })
  },
  formLabel: {
    display: 'block',
    marginBottom: '12px',
    fontSize: pick({ mobile: '15px', tablet: '17px', tabletA9: '17px', desktop: '18px' }),
    fontWeight: '600',
    color: RAIM_COLORS.DARK
  },
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: pick({ mobile: '6px', tablet: '20px', tabletA9: '20px', desktop: '20px' }),
    padding: pick({ mobile: '10px', tablet: '20px', tabletA9: '20px', desktop: '20px' }),
    backgroundColor: 'white',
    borderRadius: pick({ mobile: '12px', tablet: '16px', tabletA9: '16px', desktop: '16px' }),
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
    minWidth: pick({ mobile: '42px', tablet: '80px', tabletA9: '80px', desktop: '80px' }),
    textAlign: 'center',
    fontSize: pick({ mobile: '14px', tablet: '24px', tabletA9: '24px', desktop: '24px' }),
    fontWeight: '800',
    color: RAIM_COLORS.DARK,
    padding: pick({ mobile: '4px 8px', tablet: '10px 18px', tabletA9: '10px 18px', desktop: '10px 18px' }),
    backgroundColor: RAIM_COLORS.BG,
    borderRadius: pick({ mobile: '8px', tablet: '12px', tabletA9: '12px', desktop: '12px' }),
    flexShrink: 0
  },
  saveButton: {
    width: '100%',
    padding: pick({ mobile: '18px', tablet: '22px', tabletA9: '22px', desktop: '24px' }),
    background: `linear-gradient(135deg, ${RAIM_COLORS.DARK}, ${RAIM_COLORS.MEDIUM})`,
    color: 'white',
    border: 'none',
    borderRadius: pick({ mobile: '16px', tablet: '18px', tabletA9: '20px', desktop: '20px' }),
    fontSize: pick({ mobile: '17px', tablet: '19px', tabletA9: '19px', desktop: '20px' }),
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: pick({ mobile: '8px', tablet: '10px', tabletA9: '10px', desktop: '12px' }),
    boxShadow: '0 8px 24px rgba(0, 68, 139, 0.3)',
    minHeight: pick({ mobile: '56px', tablet: '66px', tabletA9: '68px', desktop: '70px' })
  },
  infoText: {
    fontSize: pick({ mobile: '13px', tablet: '14px', tabletA9: '14px', desktop: '15px' }),
    color: RAIM_COLORS.MUTED,
    marginTop: pick({ mobile: '10px', tablet: '12px', tabletA9: '12px', desktop: '12px' }),
    textAlign: 'center',
    lineHeight: '1.5'
  },
  iconWrapper: {
    width: pick({ mobile: '40px', tablet: '46px', tabletA9: '46px', desktop: '48px' }),
    height: pick({ mobile: '40px', tablet: '46px', tabletA9: '46px', desktop: '48px' }),
    borderRadius: pick({ mobile: '12px', tablet: '14px', tabletA9: '14px', desktop: '14px' }),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${RAIM_COLORS.DARK}15`,
    color: RAIM_COLORS.DARK
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
  },
  confirmModal: {
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
  confirmCard: {
    backgroundColor: 'white',
    borderRadius: pick({ mobile: '20px', tablet: '22px', tabletA9: '24px', desktop: '24px' }),
    padding: pick({ mobile: '28px', tablet: '32px', tabletA9: '34px', desktop: '36px' }),
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    border: `1px solid ${RAIM_COLORS.BG}`,
    textAlign: 'center'
  },
  confirmTitle: {
    margin: '0 0 16px 0',
    fontSize: pick({ mobile: '20px', tablet: '22px', tabletA9: '24px', desktop: '24px' }),
    fontWeight: '800',
    color: '#DC2626'
  },
  confirmBody: {
    margin: '0 0 24px 0',
    fontSize: pick({ mobile: '15px', tablet: '16px', tabletA9: '16px', desktop: '17px' }),
    color: RAIM_COLORS.MUTED,
    lineHeight: '1.6'
  },
  confirmButtonRow: {
    display: 'flex',
    gap: pick({ mobile: '12px', tablet: '14px', tabletA9: '16px', desktop: '16px' }),
    justifyContent: 'center'
  },
  confirmCancelButton: {
    flex: 1,
    padding: pick({ mobile: '12px 16px', tablet: '14px 20px', tabletA9: '14px 20px', desktop: '14px 20px' }),
    background: '#E2E8F0',
    color: RAIM_COLORS.MUTED,
    border: 'none',
    borderRadius: '12px',
    fontSize: pick({ mobile: '16px', tablet: '17px', tabletA9: '17px', desktop: '17px' }),
    fontWeight: '700',
    cursor: 'pointer'
  },
  confirmSubmitButton: {
    flex: 1,
    padding: pick({ mobile: '12px 16px', tablet: '14px 20px', tabletA9: '14px 20px', desktop: '14px 20px' }),
    background: '#DC2626',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: pick({ mobile: '16px', tablet: '17px', tabletA9: '17px', desktop: '17px' }),
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
  }
  };
};

export default function Dashboard({ onClose, onSave }) {
  const { device } = useIsMobile();
  const styles = getStyles(device);
  const retryTimeoutRef = useRef(null);
  
  const [todayCount, setTodayCount] = useState(0);
  const [ageCorrection, setAgeCorrection] = useState(4);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [visitorStats, setVisitorStats] = useState({
    ageGroups: {},
    ageGroupGender: {},
    gender: { male: 0, female: 0 }
  });
  const [showBackupConfirm, setShowBackupConfirm] = useState(false);
  const [backupStatus, setBackupStatus] = useState('idle'); // idle, loading, success, error
  const [backupMessage, setBackupMessage] = useState('');
  
  // 관람실 관리 state
  const [roomItems, setRoomItems] = useState([]);
  const [showRoomManagement, setShowRoomManagement] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  
  // 알림 모달 state
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetRoom, setDeleteTargetRoom] = useState(null);

  const roomNames = useMemo(() => roomItems.map((room) => room.name), [roomItems]);
  
  // 백업 진행 중 여부 (backupStatus로부터 계산)
  const isBackupInProgress = useMemo(() => backupStatus === 'loading', [backupStatus]);

  // 오늘의 방문객 데이터 분석 (현재 관람실만 필터링)
  const analyzeVisitorData = useCallback((currentRoom) => {
    const today = new Date().toISOString().split('T')[0]; // ISO 형식: YYYY-MM-DD
    const todayDataKey = `todayVisitors_${today}`;
    const savedVisitors = localStorage.getItem(todayDataKey);
    
    if (savedVisitors) {
      let allVisitors = [];
      try {
        const parsed = JSON.parse(savedVisitors);
        allVisitors = Array.isArray(parsed) ? parsed : [];
      } catch (parseError) {
        console.warn('오늘 방문객 데이터 파싱 실패:', parseError);
        allVisitors = [];
      }
      // 현재 관람실의 방문객만 필터링
      const visitors = currentRoom 
        ? allVisitors.filter(v => v.location === currentRoom)
        : allVisitors;
      
      const ageGroupCount = {};
      const ageGroupGender = {}; // 연령대별 남녀 통계
      const genderCount = { male: 0, female: 0 };

      visitors.forEach(visitor => {
        const normalizedAgeGroup = normalizeAgeGroupId(visitor.ageGroup);
        // 데이터는 이제 항상 영문 코드 형식으로 저장됨
        const normalizedGender = visitor.gender === 'male' ? 'male' : visitor.gender === 'female' ? 'female' : '';

        // 연령대 집계
        ageGroupCount[normalizedAgeGroup] = (ageGroupCount[normalizedAgeGroup] || 0) + 1;
        
        // 연령대별 남녀 집계
        if (!ageGroupGender[normalizedAgeGroup]) {
          ageGroupGender[normalizedAgeGroup] = { male: 0, female: 0 };
        }
        if (normalizedGender === 'male') {
          ageGroupGender[normalizedAgeGroup].male++;
        } else if (normalizedGender === 'female') {
          ageGroupGender[normalizedAgeGroup].female++;
        }
        
        // 전체 성별 집계
        if (normalizedGender === 'male') {
          genderCount.male++;
        } else if (normalizedGender === 'female') {
          genderCount.female++;
        }
      });
      
      setTodayCount(visitors.length);
      setVisitorStats({
        ageGroups: ageGroupCount,
        ageGroupGender: ageGroupGender,
        gender: genderCount
      });
    } else {
      // 데이터가 없을 경우 초기화
      setTodayCount(0);
      setVisitorStats({
        ageGroups: {},
        ageGroupGender: {},
        gender: { male: 0, female: 0 }
      });
    }
  }, []);

  // Firebase에서 관람실 목록 로드 (캐시 우선)
  const loadRoomLocations = useCallback(async () => {
    const cachedRooms = localStorage.getItem(ROOM_CACHE_KEY);
    if (cachedRooms) {
      try {
        const parsed = JSON.parse(cachedRooms);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRoomItems(parsed.map((room) => ({ id: room.id, name: room.name })));
        }
      } catch (error) {
        console.error('관람실 캐시 파싱 실패:', error);
      }
    }

    setIsLoadingRooms(true);
    try {
      const result = await getRoomLocations();
      if (result.success && result.data.length > 0) {
        setRoomItems(result.data.map((room) => ({ id: room.id, name: room.name })));
        localStorage.setItem(ROOM_CACHE_KEY, JSON.stringify(result.data));
      } else {
        // Firebase 초기화 안 되거나 빈 데이터 시 캐시도 비움
        setRoomItems([]);
        localStorage.removeItem(ROOM_CACHE_KEY);
      }
    } catch (error) {
      console.error('관람실 로드 실패:', error);
    } finally {
      setIsLoadingRooms(false);
    }
  }, []);

  useEffect(() => {
    // Firebase에서 관람실 목록 로드
    loadRoomLocations();

    // 저장된 나이 보정값 로드
    const savedCorrection = localStorage.getItem('ageCorrection');
    if (savedCorrection) {
      setAgeCorrection(parseInt(savedCorrection, 10));
    }

    // 저장된 관람실 정보 로드
    const savedRoom = localStorage.getItem('room_location');
    if (savedRoom) {
      setSelectedRoom(savedRoom);
      // 관람실별 방문객 데이터 분석
      analyzeVisitorData(savedRoom);
    } else {
      // 관람실이 없으면 전체 데이터 분석
      analyzeVisitorData(null);
    }

    // Cleanup 함수
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [loadRoomLocations, analyzeVisitorData]);

  // 관람실 선택 변경 시 통계 자동 갱신
  useEffect(() => {
    analyzeVisitorData(selectedRoom || null);
  }, [selectedRoom, analyzeVisitorData]);

  // 관람실 추가
  const handleAddRoom = async () => {
    const trimmedName = newRoomName.trim();
    if (!trimmedName) {
      setAlertMessage('관람실 이름을 입력해주세요.');
      setShowAlertModal(true);
      return;
    }
    
    if (roomNames.includes(trimmedName)) {
      setAlertMessage('이미 존재하는 관람실입니다.');
      setShowAlertModal(true);
      return;
    }

    const result = await addRoomLocation(trimmedName);
    if (result.success) {
      const updatedRooms = [...roomItems, { id: result.id, name: trimmedName }];
      setRoomItems(updatedRooms);
      localStorage.setItem(
        ROOM_CACHE_KEY,
        JSON.stringify(updatedRooms.filter((room) => room.id))
      );
      setNewRoomName('');
      setAlertMessage('관람실이 추가되었습니다.');
      setShowAlertModal(true);
    } else {
      setAlertMessage('관람실 추가에 실패했습니다: ' + result.error);
      setShowAlertModal(true);
    }
  };

  // 관람실 삭제 확인 모달
  const showDeleteConfirmModal = (roomName) => {
    setDeleteTargetRoom(roomName);
    setShowDeleteConfirm(true);
  };

  // 관람실 삭제 실행
  const handleDeleteRoom = async (roomName) => {
    const roomToDelete = roomItems.find((room) => room.name === roomName);
    if (!roomToDelete) {
      return;
    }

    const result = await deleteRoomLocation(roomToDelete.id);
    if (result.success) {
      const updatedRooms = roomItems.filter((room) => room.id !== roomToDelete.id);
      setRoomItems(updatedRooms);
      localStorage.setItem(
        ROOM_CACHE_KEY,
        JSON.stringify(updatedRooms)
      );
      
      // 현재 선택된 관람실이 삭제되는 경우 선택 해제
      if (selectedRoom === roomName) {
        setSelectedRoom('');
        localStorage.removeItem('room_location');
      }
      
      setAlertMessage('관람실이 삭제되었습니다.');
      setShowAlertModal(true);
      setShowDeleteConfirm(false);
      setDeleteTargetRoom(null);
    } else {
      setAlertMessage('관람실 삭제에 실패했습니다: ' + result.error);
      setShowAlertModal(true);
      setShowDeleteConfirm(false);
      setDeleteTargetRoom(null);
    }
  };

  const handleSave = () => {
    if (!selectedRoom) {
      setAlertMessage("관람실을 선택해주세요.");
      setShowAlertModal(true);
      return;
    }
    
    // 나이 보정값 저장
    localStorage.setItem('ageCorrection', ageCorrection.toString());
    
    // 관람실 정보 저장
    localStorage.setItem('room_location', selectedRoom);
    
    // 관람실이 변경되었으면 데이터 다시 분석
    analyzeVisitorData(selectedRoom);

    setShowSaveModal(true);
  };

  const handleCloseSaveModal = () => {
    setShowSaveModal(false);
    onSave();
  };

  const triggerBackup = async (retryCount = 0) => {
    // 중복 호출 방지 (첫 호출에만 적용)
    if (retryCount === 0 && backupStatus === 'loading') {
      setBackupMessage('⏳ 백업이 이미 진행 중입니다. 완료될 때까지 기다려주세요.');
      return;
    }

    if (retryCount === 0) {
      setBackupStatus('loading');
      setBackupMessage('백업 및 삭제 작업을 시작하고 있습니다...');
    }

    const maxRetries = 2;
    const backupUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;

    if (!backupUrl) {
      setBackupStatus('error');
      setBackupMessage('✗ 백업 URL이 설정되지 않았습니다.\n환경 변수를 확인해주세요.');
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      // Google Apps Script는 GET 요청으로 CORS 우회
      // 캐시 무효화를 위해 타임스탬프 추가
      const response = await fetch(backupUrl + '?action=backup&t=' + Date.now(), {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      if (result.success) {
        setBackupStatus('success');
        setBackupMessage('✓ 백업 및 삭제 성공');
      } else if (retryCount < maxRetries) {
        // 오류 발생 시 재시도
        setBackupMessage(`⚠️ 작업 실패 (${retryCount + 1}/${maxRetries} 재시도 중)\n오류: ${result.error || '알 수 없는 오류'}`);

        // 2초 대기 후 자동 재시도
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }
        retryTimeoutRef.current = setTimeout(() => {
          triggerBackup(retryCount + 1);
        }, 2000);
      } else {
        setBackupStatus('error');
        setBackupMessage(`✗ 최대 재시도 횟수 초과\n오류: ${result.error || '알 수 없는 오류'}\n\n관리자에게 문의하세요.`);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      const isTimeout = error.name === 'AbortError';
      const errorLabel = isTimeout ? '요청 시간이 초과되었습니다' : '네트워크 오류';

      // 네트워크/타임아웃 오류 시 재시도
      if (retryCount < maxRetries) {
        setBackupMessage(`⚠️ ${errorLabel} (${retryCount + 1}/${maxRetries} 재시도 중)\n${error.message}`);

        // 3초 대기 후 자동 재시도
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }
        retryTimeoutRef.current = setTimeout(() => {
          triggerBackup(retryCount + 1);
        }, 3000);
      } else {
        setBackupStatus('error');
        setBackupMessage(`✗ 요청 실패 (최대 재시도 초과)\n${error.message}\n\n인터넷 연결을 확인하고 다시 시도해주세요.`);
      }
    }
  };

  const handleBackupClick = () => {
    setShowBackupConfirm(true);
  };

  const handleConfirmBackup = () => {
    setShowBackupConfirm(false);
    triggerBackup();
  };

  // 슬라이더 배경색 계산 메모이제이션
  const sliderBackground = useMemo(
    () => `linear-gradient(to right, ${RAIM_COLORS.DARK} 0%, ${RAIM_COLORS.DARK} ${((ageCorrection + 10) / 20) * 100}%, ${RAIM_COLORS.BG} ${((ageCorrection + 10) / 20) * 100}%, ${RAIM_COLORS.BG} 100%)`,
    [ageCorrection]
  );

  const sliderStyle = useMemo(() => ({
    ...styles.slider,
    background: sliderBackground
  }), [styles.slider, sliderBackground]);

  return (
    <div style={styles.dashboardOverlay}>
      <div style={styles.dashboardModal}>
        <div style={styles.dashboardHeader}>
          <h2 style={styles.dashboardTitle}>
            <Settings size={25} />
            관리자 대시보드
          </h2>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={25} />
          </button>
        </div>

        <div style={styles.gridContainer}>
          {/* 오늘의 입장객 수 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box', width: '100%', maxWidth: '100%', minWidth: 0 }}>
            <div style={styles.statsCard}>
              <div style={styles.statsContent}>
                <div style={styles.statsLabel}>
                  {selectedRoom ? `${selectedRoom} - 오늘의 누적 입장객` : '오늘의 누적 입장객 수'}
                </div>
                <div style={styles.statsNumber}>{todayCount.toLocaleString()}명</div>
              </div>
              <Calendar size={device === 'mobile' ? 50 : 60} color="white" style={styles.statsIcon} />
            </div>
            <div style={{ 
              fontSize: device === 'mobile' ? '11px' : '13px', 
              color: RAIM_COLORS.MUTED, 
              textAlign: 'center', 
              lineHeight: '1.4', 
              padding: '0 8px' 
            }}>
              기기 임시 저장 데이터입니다.<br />
              정확한 전체 데이터는 Firebase 또는 엑셀을 확인하세요.
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
            <AgeGroupChart visitorStats={visitorStats} />
            <div style={{ marginTop: '20px' }}>
              <GenderChart visitorStats={visitorStats} />
            </div>
            <div style={styles.infoText}>
              오늘 {selectedRoom ? `${selectedRoom} ` : ''}방문객의 분포입니다.
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={styles.formLabel}>관람실 선택</label>
              <button
                onClick={() => setShowRoomManagement(true)}
                style={{
                  padding: '8px 14px',
                  background: RAIM_COLORS.DARK,
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Edit3 size={16} />
                관람실 관리
              </button>
            </div>
            <div style={styles.selectWrapper}>
              <MapPin size={24} color={RAIM_COLORS.MUTED} style={{position:'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', zIndex: 1}} />
              <select 
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                style={styles.select}
              >
                <option value="">관람실 선택</option>
                {roomItems.map((room) => (
                  <option key={room.name} value={room.name}>{room.name}</option>
                ))}
              </select>
              <ChevronDown 
                size={24} 
                color={RAIM_COLORS.MUTED} 
                style={styles.selectIcon}
              />
            </div>
            
            <div style={styles.infoText}>
              방문객 데이터에 관람실 정보가 함께 저장됩니다.
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
                style={sliderStyle}
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

        {/* Firebase 데이터 백업 및 삭제 섹션 */}
        <BackupSection 
          backupStatus={backupStatus}
          backupMessage={backupMessage}
          isBackupInProgress={isBackupInProgress}
          onBackupClick={handleBackupClick}
        />

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

      {showBackupConfirm && (
        <div style={styles.confirmModal}>
          <div style={styles.confirmCard}>
            <h3 style={styles.confirmTitle}>정말로 실행하시겠습니까?</h3>
            <p style={styles.confirmBody}>
              <strong>이 작업은 되돌릴 수 없습니다!</strong>
            </p>
            <div style={styles.confirmButtonRow}>
              <button 
                style={styles.confirmCancelButton}
                onClick={() => setShowBackupConfirm(false)}
              >
                취소
              </button>
              <button 
                style={styles.confirmSubmitButton}
                onClick={handleConfirmBackup}
              >
                실행하기
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }
        .backup-button:not(:disabled):hover {
          background: #B91C1C !important;
          box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4) !important;
        }
      `}</style>

      <RoomManagementModal 
        isOpen={showRoomManagement}
        onClose={() => setShowRoomManagement(false)}
        roomItems={roomItems}
        selectedRoom={selectedRoom}
        newRoomName={newRoomName}
        setNewRoomName={setNewRoomName}
        isLoadingRooms={isLoadingRooms}
        onAddRoom={handleAddRoom}
        onDeleteRoom={showDeleteConfirmModal}
      />

      {/* 일반 알림 모달 */}
      {showAlertModal && (
        <div style={styles.confirmModal}>
          <div style={styles.confirmCard}>
            <h3 style={styles.confirmTitle}>알림</h3>
            <p style={styles.confirmBody}>{alertMessage}</p>
            <div style={styles.confirmButtonRow}>
              <button 
                style={styles.confirmSubmitButton}
                onClick={() => setShowAlertModal(false)}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div style={styles.confirmModal}>
          <div style={styles.confirmCard}>
            <h3 style={styles.confirmTitle}>관람실 삭제</h3>
            <p style={styles.confirmBody}>
              <strong>"{deleteTargetRoom}"을(를) 정말 삭제하시겠습니까?</strong>
            </p>
            <div style={styles.confirmButtonRow}>
              <button 
                style={styles.confirmCancelButton}
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteTargetRoom(null);
                }}
              >
                취소
              </button>
              <button 
                style={styles.confirmSubmitButton}
                onClick={() => handleDeleteRoom(deleteTargetRoom)}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
