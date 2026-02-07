import { AlertTriangle, Database, Loader } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { RAIM_COLORS } from '../../constants';

const getStyles = (device) => {
  const pick = (map) => map[device] ?? map.desktop;
  return {
    backupSection: {
      backgroundColor: '#FFF5F5',
      borderRadius: pick({ mobile: '16px', tablet: '18px', tabletA9: '20px', desktop: '20px' }),
      padding: pick({ mobile: '20px', tablet: '26px', tabletA9: '28px', desktop: '30px' }),
      marginBottom: pick({ mobile: '30px', tablet: '50px', tabletA9: '14px', desktop: '16px' }),
      border: `2px solid #FCA5A5`,
      borderTop: `4px solid #DC2626`,
      boxSizing: 'border-box',
      width: '100%',
      maxWidth: '100%'
    },
    backupTitle: {
      fontSize: pick({ mobile: '18px', tablet: '20px', tabletA9: '21px', desktop: '22px' }),
      color: '#DC2626',
      fontWeight: '700',
      marginBottom: pick({ mobile: '12px', tablet: '16px', tabletA9: '18px', desktop: '20px' }),
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    backupDescription: {
      fontSize: pick({ mobile: '14px', tablet: '15px', tabletA9: '16px', desktop: '16px' }),
      color: '#7F1D1D',
      marginBottom: pick({ mobile: '18px', tablet: '20px', tabletA9: '22px', desktop: '24px' }),
      lineHeight: '1.6'
    },
    backupButton: {
      width: '100%',
      padding: pick({ mobile: '16px', tablet: '18px', tabletA9: '20px', desktop: '20px' }),
      background: '#DC2626',
      color: 'white',
      border: 'none',
      borderRadius: pick({ mobile: '14px', tablet: '16px', tabletA9: '18px', desktop: '18px' }),
      fontSize: pick({ mobile: '16px', tablet: '17px', tabletA9: '18px', desktop: '18px' }),
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: pick({ mobile: '8px', tablet: '10px', tabletA9: '10px', desktop: '12px' }),
      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
      minHeight: pick({ mobile: '50px', tablet: '58px', tabletA9: '60px', desktop: '62px' })
    }
  };
};

export default function BackupSection({ backupStatus, backupMessage, isBackupInProgress, onBackupClick }) {
  const { device } = useIsMobile();
  const styles = getStyles(device);

  return (
    <div style={styles.backupSection}>
      <h3 style={styles.backupTitle}>
        <AlertTriangle size={24} />
        데이터 백업 및 삭제
      </h3>
      <p style={styles.backupDescription}>
        Firebase Firestore의 모든 방문객 데이터를 엑셀로 자동 백업하고 Firestore에서 삭제합니다.<br />
        <br />
        <strong>⚠️ 주의:</strong> 이 작업은 되돌릴 수 없습니다.
      </p>
      <button 
        style={styles.backupButton}
        onClick={onBackupClick}
        disabled={backupStatus === 'loading' || isBackupInProgress}
        className="backup-button"
      >
        {backupStatus === 'loading' ? (
          <>
            <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
            진행 중...
          </>
        ) : (
          <>
            <Database size={20} />
            지금 백업 및 삭제 실행
          </>
        )}
      </button>
      {backupStatus === 'success' && (
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#DCFCE7', borderRadius: '12px', border: '1px solid #86EFAC', fontSize: '14px', color: '#15803D', whiteSpace: 'pre-wrap' }}>
          {backupMessage}
        </div>
      )}
      {backupStatus === 'error' && (
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#FEE2E2', borderRadius: '12px', border: '1px solid #FCA5A5', fontSize: '14px', color: '#7F1D1D', whiteSpace: 'pre-wrap' }}>
          {backupMessage}
        </div>
      )}
    </div>
  );
}
