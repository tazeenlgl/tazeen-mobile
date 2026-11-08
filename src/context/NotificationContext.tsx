import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { usePersistedState } from '../utils/storage';

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string; // ISO date
  read: boolean;
  orderId?: string;
};

type NotificationContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  notify: (title: string, body: string, orderId?: string) => void;
  markAllRead: () => void;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

// In-app notification centre. Real push alerts need a backend + FCM; this
// keeps the same shape so `notify` can be fed from push messages later.
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = usePersistedState<AppNotification[]>(
    'notifications',
    [],
  );

  const notify = useCallback(
    (title: string, body: string, orderId?: string) =>
      setNotifications(current =>
        [
          {
            id: `n-${Date.now()}-${current.length}`,
            title,
            body,
            createdAt: new Date().toISOString(),
            read: false,
            orderId,
          },
          ...current,
        ].slice(0, 50),
      ),
    [setNotifications],
  );

  const markAllRead = useCallback(
    () => setNotifications(current => current.map(item => ({ ...item, read: true }))),
    [setNotifications],
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter(item => !item.read).length,
      notify,
      markAllRead,
    }),
    [notifications, notify, markAllRead],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
