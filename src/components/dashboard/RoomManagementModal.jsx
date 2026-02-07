import { X, Plus, Trash2 } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { RAIM_COLORS } from '../../constants';

const getStyles = (device) => {
  const pick = (map) => map[device] ?? map.desktop;
  return {
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
      boxShadow: '0 18px 40px rgba(0, 68, 139, 0.25)',
      border: `1px solid ${RAIM_COLORS.BG}`,
      textAlign: 'center'
    }
  };
};

export default function RoomManagementModal({ 
  isOpen, 
  onClose, 
  roomItems,
  selectedRoom,
  newRoomName,
  setNewRoomName,
  isLoadingRooms,
  onAddRoom,
  onDeleteRoom
}) {
  const { device } = useIsMobile();
  const styles = getStyles(device);

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{
        ...styles.modalCard,
        maxWidth: device === 'mobile' ? '95%' : '550px',
        maxHeight: device === 'mobile' ? '85vh' : '80vh',
        overflowY: 'auto',
        padding: device === 'mobile' ? '20px' : styles.modalCard.padding,
        textAlign: 'left'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: device === 'mobile' ? '16px' : '20px' }}>
          <h3 style={{ margin: 0, fontSize: device === 'mobile' ? '18px' : '22px', fontWeight: '800', color: RAIM_COLORS.DARK }}>
            관람실 관리
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={24} color={RAIM_COLORS.MUTED} />
          </button>
        </div>

        {/* 관람실 추가 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '15px', fontWeight: '600', color: RAIM_COLORS.DARK }}>
            새 관람실 추가
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onAddRoom();
                }
              }}
              placeholder="관람실 이름 입력"
              style={{
                flex: 1,
                padding: '12px 16px',
                fontSize: '16px',
                border: `2px solid ${RAIM_COLORS.BG}`,
                borderRadius: '12px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <button
              onClick={onAddRoom}
              disabled={!newRoomName.trim()}
              style={{
                padding: device === 'mobile' ? '12px 16px' : '12px 18px',
                background: newRoomName.trim() ? RAIM_COLORS.DARK : '#CBD5E0',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: newRoomName.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                minWidth: device === 'mobile' ? '70px' : 'auto'
              }}
            >
              {device !== 'mobile' && <Plus size={18} />}
              추가
            </button>
          </div>
        </div>

        {/* 관람실 목록 */}
        <div>
          <label style={{ display: 'block', marginBottom: '12px', fontSize: '15px', fontWeight: '600', color: RAIM_COLORS.DARK }}>
            현재 관람실 목록
          </label>
          {isLoadingRooms ? (
            <div style={{ textAlign: 'center', padding: '20px', color: RAIM_COLORS.MUTED }}>
              로딩 중...
            </div>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {roomItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: RAIM_COLORS.MUTED }}>
                  등록된 관람실이 없습니다.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {roomItems.map((room) => (
                    <div
                      key={room.id || room.name}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '14px 16px',
                        background: selectedRoom === room.name ? `${RAIM_COLORS.DARK}15` : RAIM_COLORS.BG,
                        borderRadius: '10px',
                        border: selectedRoom === room.name ? `2px solid ${RAIM_COLORS.DARK}` : '2px solid transparent'
                      }}
                    >
                      <span style={{ fontSize: '16px', fontWeight: selectedRoom === room.name ? '600' : '500', color: RAIM_COLORS.DARK }}>
                        {room.name}
                        {selectedRoom === room.name && (
                          <span style={{ marginLeft: '8px', fontSize: '14px', color: RAIM_COLORS.MEDIUM }}>
                            (현재 선택됨)
                          </span>
                        )}
                      </span>
                      <button
                        onClick={() => onDeleteRoom(room.name)}
                        style={{
                          padding: '8px 12px',
                          background: 'transparent',
                          color: RAIM_COLORS.DANGER,
                          border: `1px solid ${RAIM_COLORS.DANGER}`,
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = RAIM_COLORS.DANGER;
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = RAIM_COLORS.DANGER;
                        }}
                      >
                        <Trash2 size={14} />
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              background: RAIM_COLORS.DARK,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
