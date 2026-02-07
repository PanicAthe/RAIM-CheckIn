import { useState, useEffect } from 'react';
import { LockKeyhole, KeyRound, MapPin, ChevronDown } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';
import { ADMIN_PIN, RAIM_COLORS, ROOM_CACHE_KEY } from '../constants';
import logoImg from '../assets/logo.png';
import { getRoomLocations } from '../firebase';

const getLockStyles = (device) => {
  const pick = (map) => map[device] ?? map.desktop;
  const radius = pick({ mobile: '20px', tablet: '24px', tabletA9: '26px', desktop: '28px' });

  return {
    container: { 
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', 
      backgroundColor: RAIM_COLORS.BG, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'flex-start', 
      paddingTop: pick({ mobile: '24px', tablet: '40px', tabletA9: '60px', desktop: '80px' }),
      zIndex: 9999,
      padding: pick({ mobile: '24px 12px 12px 12px', tablet: '40px 16px 16px 16px', tabletA9: '60px 18px 18px 18px', desktop: '80px 20px 20px 20px' }),
      boxSizing: 'border-box'
    },
    card: { 
      backgroundColor: 'white', 
      padding: pick({ mobile: '34px 24px', tablet: '44px 32px', tabletA9: '48px 34px', desktop: '50px 40px' }), 
      borderRadius: radius, textAlign: 'center', 
      maxWidth: '520px', width: '100%', 
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)' 
    },
    iconWrapper: { 
      width: pick({ mobile: '64px', tablet: '72px', tabletA9: '76px', desktop: '80px' }), height: pick({ mobile: '64px', tablet: '72px', tabletA9: '76px', desktop: '80px' }), 
      borderRadius: '50%', backgroundColor: RAIM_COLORS.GRAY_BG, 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      margin: '0 auto 18px auto' 
    },
    title: { 
      margin: '0 0 8px 0', fontSize: pick({ mobile: '24px', tablet: '28px', tabletA9: '30px', desktop: '32px' }), 
      fontWeight: '800', color: RAIM_COLORS.DARK 
    },
    desc: { 
      margin: '0 0 24px 0', fontSize: pick({ mobile: '16px', tablet: '17px', tabletA9: '18px', desktop: '18px' }), color: '#6B7280',
      lineHeight: '1.5'
    },
    form: { 
      display: 'flex', flexDirection: 'column', gap: pick({ mobile: '14px', tablet: '16px', tabletA9: '18px', desktop: '20px' }) 
    },
    inputWrapper: { 
      position: 'relative', display: 'flex', alignItems: 'center' 
    },
    input: { 
      width: '100%', padding: pick({ mobile: '16px 18px 16px 52px', tablet: '18px 20px 18px 56px', tabletA9: '18px 20px 18px 56px', desktop: '20px 20px 20px 56px' }), fontSize: pick({ mobile: '18px', tablet: '19px', tabletA9: '20px', desktop: '20px' }), 
      border: '2px solid #E5E7EB', borderRadius: '16px', outline: 'none', 
      transition: 'border 0.2s', boxSizing: 'border-box',
      minHeight: pick({ mobile: '56px', tablet: '60px', tabletA9: '62px', desktop: '64px' })
    },
    errorMsg: { 
      color: RAIM_COLORS.DANGER, fontSize: '16px', margin: '-6px 0 0 0', 
      textAlign: 'left' 
    },
    button: { 
      width: '100%', padding: pick({ mobile: '16px', tablet: '20px', tabletA9: '21px', desktop: '22px' }), backgroundColor: RAIM_COLORS.DARK, 
      color: 'white', border: 'none', borderRadius: '16px', fontSize: pick({ mobile: '18px', tablet: '19px', tabletA9: '20px', desktop: '20px' }), 
      fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s',
      minHeight: pick({ mobile: '56px', tablet: '62px', tabletA9: '66px', desktop: '70px' })
    },
    footer: { 
      marginTop: pick({ mobile: '24px', tablet: '32px', tabletA9: '36px', desktop: '40px' }) 
    },
    selectWrapper: {
      position: 'relative',
      marginBottom: pick({ mobile: '12px', tablet: '16px', tabletA9: '18px', desktop: '20px' })
    },
    select: {
      width: '100%',
      padding: pick({ mobile: '16px 18px 16px 52px', tablet: '18px 20px 18px 56px', tabletA9: '18px 20px 18px 56px', desktop: '20px 20px 20px 56px' }),
      fontSize: pick({ mobile: '18px', tablet: '19px', tabletA9: '20px', desktop: '20px' }),
      border: '2px solid #E5E7EB',
      borderRadius: '16px',
      outline: 'none',
      transition: 'border 0.2s',
      boxSizing: 'border-box',
      backgroundColor: 'white',
      cursor: 'pointer',
      minHeight: pick({ mobile: '56px', tablet: '60px', tabletA9: '62px', desktop: '64px' }),
      appearance: 'none',
      WebkitAppearance: 'none',
      MozAppearance: 'none'
    },
    selectIcon: {
      position: 'absolute',
      right: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      zIndex: 1
    },
    logoImage: {
      height: pick({ mobile: '78px', tablet: '90px', tabletA9: '96px', desktop: '100px' })
    }
  };
};

export default function AdminLockScreen({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [roomItems, setRoomItems] = useState([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const { device } = useIsMobile();
  const styles = getLockStyles(device);

  useEffect(() => {
    const savedRoom = localStorage.getItem('room_location');
    if (savedRoom) {
      setSelectedRoom(savedRoom);
    }

    const cachedRooms = localStorage.getItem(ROOM_CACHE_KEY);
    if (cachedRooms) {
      try {
        const parsed = JSON.parse(cachedRooms);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRoomItems(parsed);
        } else {
          setRoomItems([]);
        }
      } catch (error) {
        console.error('관람실 캐시 파싱 실패:', error);
        setRoomItems([]);
      }
    } else {
      setRoomItems([]);
    }

    const loadRooms = async () => {
      setIsLoadingRooms(true);
      try {
        const result = await getRoomLocations();
        if (result.success && result.data.length > 0) {
          setRoomItems(result.data);
          localStorage.setItem(ROOM_CACHE_KEY, JSON.stringify(result.data));
        }
      } catch (error) {
        console.error('관람실 로드 실패:', error);
      } finally {
        setIsLoadingRooms(false);
      }
    };

    loadRooms();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (pin === ADMIN_PIN) {
      if (selectedRoom) {
        localStorage.setItem('room_location', selectedRoom);
      } else {
        localStorage.removeItem('room_location');
      }
      onUnlock();
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconWrapper}>
          <LockKeyhole size={48} color={RAIM_COLORS.DARK} />
        </div>
        <h2 style={styles.title}>관리자 잠금</h2>
        <p style={styles.desc}>관람실을 선택하고 비밀번호를 입력하세요.</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.selectWrapper}>
            <MapPin size={24} color={RAIM_COLORS.MUTED} style={{position:'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 1}} />
            <select 
              value={selectedRoom}
              onChange={(e) => {
                setSelectedRoom(e.target.value);
              }}
              style={styles.select}
            >
              <option value="">관람실 선택</option>
              {isLoadingRooms && <option value="" disabled>관람실 불러오는 중...</option>}
              {roomItems.map((room) => (
                <option key={room.id || room.name} value={room.name}>{room.name}</option>
              ))}
            </select>
            <ChevronDown 
              size={24} 
              color={RAIM_COLORS.MUTED} 
              style={styles.selectIcon}
            />
          </div>
          <div style={styles.inputWrapper}>
            <KeyRound size={24} color={RAIM_COLORS.MUTED} style={{position:'absolute', left:'20px'}} />
            <input 
              type="password" 
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(false); }}
              placeholder="PIN"
              inputMode="numeric"
              style={{
                ...styles.input,
                borderColor: error ? RAIM_COLORS.DANGER : '#E5E7EB'
              }}
              autoFocus
            />
          </div>
          {error && <p style={styles.errorMsg}>비밀번호 오류</p>}
          <button type="submit" style={styles.button}>
            해제
          </button>
        </form>
        <div style={styles.footer}>
          <img src={logoImg} alt="Logo" style={styles.logoImage} />
        </div>
      </div>
    </div>
  );
}
