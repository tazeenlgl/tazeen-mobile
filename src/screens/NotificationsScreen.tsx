import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import SubScreen from '../components/common/SubScreen';
import { useNotifications } from '../context/NotificationContext';
import { formatDateTime } from '../utils/pricing';

type NotificationsScreenProps = {
  onBack: () => void;
  onCartPress: () => void;
  onOpenOrder: (orderId: string) => void;
};

export default function NotificationsScreen({
  onBack,
  onCartPress,
  onOpenOrder,
}: NotificationsScreenProps) {
  const { notifications, markAllRead } = useNotifications();
  // Shown as unread on arrival, cleared once the list has been seen.
  const [seen] = React.useState(() => new Set(notifications.filter(n => !n.read).map(n => n.id)));

  useEffect(() => {
    markAllRead();
  }, [markAllRead]);

  return (
    <SubScreen title="Notifications" onBack={onBack} onCartPress={onCartPress}>
      {notifications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptyBody}>Order updates will show up here.</Text>
        </View>
      ) : (
        notifications.map(item => (
          <Pressable
            key={item.id}
            style={[styles.card, seen.has(item.id) && styles.cardNew]}
            onPress={() => item.orderId && onOpenOrder(item.orderId)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
            <Text style={styles.time}>{formatDateTime(item.createdAt)}</Text>
          </Pressable>
        ))
      )}
    </SubScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    marginBottom: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  cardNew: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  title: { fontSize: 14, fontWeight: '700', color: colors.heading },
  body: { marginTop: 3, fontSize: 13, lineHeight: 18, color: colors.textSecondary },
  time: { marginTop: 6, fontSize: 11, color: colors.placeholder },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: colors.heading },
  emptyBody: { marginTop: 6, fontSize: 14, color: colors.textSecondary },
});
