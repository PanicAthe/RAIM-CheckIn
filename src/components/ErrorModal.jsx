import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { RAIM_COLORS } from '../constants';

const modalStyles = {
  overlay: { 
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
    backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', 
    alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' 
  },
  container: { 
    backgroundColor: 'white', padding: '30px', borderRadius: '24px', 
    textAlign: 'center', maxWidth: '380px', width: '90%', 
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)', animation: 'fadeIn 0.3s ease-out' 
  },
  iconCircle: { 
    width: '70px', height: '70px', borderRadius: '50%', 
    backgroundColor: '#FEE2E2', display: 'flex', 
    justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px auto', 
    boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)' 
  },
  title: { 
    margin: '0 0 10px 0', fontSize: '24px', fontWeight: '800', 
    color: '#DC2626' 
  },
  message: { 
    margin: '0 0 25px 0', fontSize: '16px', color: '#666', lineHeight: '1.5',
    whiteSpace: 'pre-line'
  },
  buttonRow: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center'
  },
  retryButton: { 
    flex: 1,
    padding: '15px', backgroundColor: RAIM_COLORS.DARK, 
    color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', 
    fontWeight: 'bold', cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  cancelButton: { 
    flex: 1,
    padding: '15px', backgroundColor: '#E5E7EB', 
    color: '#374151', border: 'none', borderRadius: '12px', fontSize: '16px', 
    fontWeight: 'bold', cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  }
};

export default function ErrorModal({ isOpen, onClose, onRetry, message, showRetry = true }) {
  if (!isOpen) return null;
  
  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.container}>
        <div style={modalStyles.iconCircle}>
          <AlertCircle size={40} color="#DC2626" />
        </div>
        <h2 style={modalStyles.title}>전송 실패</h2>
        <p style={modalStyles.message}>
          {message || '데이터 전송에 실패했습니다.\n인터넷 연결을 확인해주세요.'}
        </p>
        <div style={modalStyles.buttonRow}>
          {showRetry && (
            <button onClick={onRetry} style={modalStyles.retryButton}>
              <RefreshCw size={18} />
              재시도
            </button>
          )}
          <button onClick={onClose} style={modalStyles.cancelButton}>
            <X size={18} />
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
