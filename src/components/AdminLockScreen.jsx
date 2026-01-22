import { useState } from 'react';
import { LockKeyhole, KeyRound } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';
import { ADMIN_PIN, RAIM_COLORS } from '../constants';
import logoImg from '../assets/logo.png';

const getLockStyles = (isMobile) => ({
  container: { 
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', 
    backgroundColor: RAIM_COLORS.BG, 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: isMobile ? 'flex-start' : 'center', 
    paddingTop: isMobile ? '80px' : '0', 
    zIndex: 9999 
  },
  card: { 
    backgroundColor: 'white', 
    padding: isMobile ? '30px 20px' : '40px', 
    borderRadius: '24px', textAlign: 'center', 
    maxWidth: '400px', width: '90%', 
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)' 
  },
  iconWrapper: { 
    width: isMobile ? '50px' : '60px', height: isMobile ? '50px' : '60px', 
    borderRadius: '50%', backgroundColor: RAIM_COLORS.GRAY_BG, 
    display: 'flex', justifyContent: 'center', alignItems: 'center', 
    margin: '0 auto 15px auto' 
  },
  title: { 
    margin: '0 0 5px 0', fontSize: isMobile ? '20px' : '22px', 
    fontWeight: '800', color: RAIM_COLORS.DARK 
  },
  desc: { 
    margin: '0 0 25px 0', fontSize: '14px', color: '#6B7280' 
  },
  form: { 
    display: 'flex', flexDirection: 'column', gap: '15px' 
  },
  inputWrapper: { 
    position: 'relative', display: 'flex', alignItems: 'center' 
  },
  input: { 
    width: '100%', padding: '15px 15px 15px 45px', fontSize: '16px', 
    border: '2px solid #E5E7EB', borderRadius: '12px', outline: 'none', 
    transition: 'border 0.2s', boxSizing: 'border-box' 
  },
  errorMsg: { 
    color: RAIM_COLORS.DANGER, fontSize: '13px', margin: '-5px 0 0 0', 
    textAlign: 'left' 
  },
  button: { 
    width: '100%', padding: '16px', backgroundColor: RAIM_COLORS.DARK, 
    color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', 
    fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' 
  },
  footer: { 
    marginTop: '30px' 
  }
});

export default function AdminLockScreen({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const isMobile = useIsMobile();
  const styles = getLockStyles(isMobile);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
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
          <LockKeyhole size={isMobile ? 30 : 40} color={RAIM_COLORS.DARK} />
        </div>
        <h2 style={styles.title}>관리자 잠금</h2>
        <p style={styles.desc}>비밀번호를 입력하세요.</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputWrapper}>
            <KeyRound size={20} color={RAIM_COLORS.MUTED} style={{position:'absolute', left:'15px'}} />
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
          <img src={logoImg} alt="Logo" style={{height: '80px'}} />
        </div>
      </div>
    </div>
  );
}
