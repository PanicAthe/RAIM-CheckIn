import { CheckCircle2 } from 'lucide-react';
import { RAIM_COLORS } from '../constants';

const modalStyles = {
  overlay: { 
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', 
    alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' 
  },
  container: { 
    backgroundColor: 'white', padding: '30px', borderRadius: '24px', 
    textAlign: 'center', maxWidth: '320px', width: '90%', 
    boxShadow: '0 20px 50px rgba(0,0,0,0.2)', animation: 'fadeIn 0.3s ease-out' 
  },
  iconCircle: { 
    width: '70px', height: '70px', borderRadius: '50%', 
    backgroundColor: RAIM_COLORS.TEAL, display: 'flex', 
    justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px auto', 
    boxShadow: '0 10px 20px rgba(31, 189, 198, 0.3)' 
  },
  title: { 
    margin: '0 0 10px 0', fontSize: '24px', fontWeight: '800', 
    color: RAIM_COLORS.DARK 
  },
  message: { 
    margin: '0 0 25px 0', fontSize: '16px', color: '#666', lineHeight: '1.5' 
  },
  button: { 
    width: '100%', padding: '15px', backgroundColor: RAIM_COLORS.DARK, 
    color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', 
    fontWeight: 'bold', cursor: 'pointer' 
  }
};

export default function SuccessModal({ isOpen, onClose, count }) {
  if (!isOpen) return null;
  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.container}>
        <div style={modalStyles.iconCircle}>
          <CheckCircle2 size={40} color="white" />
        </div>
        <h2 style={modalStyles.title}>등록 완료!</h2>
        <p style={modalStyles.message}>
          총 <span style={{color: RAIM_COLORS.DARK, fontWeight:'bold'}}>{count}명</span> 등록되었습니다.<br/>
          즐거운 관람 되세요!
        </p>
        <button onClick={onClose} style={modalStyles.button}>확인</button>
      </div>
    </div>
  );
}
