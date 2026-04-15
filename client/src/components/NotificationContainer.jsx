import { useEffect, useRef, useState } from 'react';
import { useNotification } from '../context/NotificationContext';

const icons = {
  success: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>,
  error: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>,
  warning: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  info: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
};

function NotificationItem({ notification, onRemove }) {
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef(null);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onRemove(notification.id), 300);
  };

  useEffect(() => {
    timerRef.current = setTimeout(handleDismiss, notification.duration || 3500);
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div
      className={`notification notification-${notification.type} ${exiting ? 'notification-exit' : 'notification-enter'}`}
      onMouseEnter={() => clearTimeout(timerRef.current)}
      onMouseLeave={() => { timerRef.current = setTimeout(handleDismiss, 1500); }}
    >
      <div className="notification-icon">{icons[notification.type]}</div>
      <div className="notification-content">
        <p className="notification-message">{notification.message}</p>
      </div>
      <button className="notification-close" onClick={handleDismiss}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <div className="notification-progress">
        <div className="notification-progress-bar" style={{ animationDuration: `${notification.duration || 3500}ms` }}></div>
      </div>
    </div>
  );
}

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map(n => (
        <NotificationItem key={n.id} notification={n} onRemove={removeNotification} />
      ))}
    </div>
  );
}
