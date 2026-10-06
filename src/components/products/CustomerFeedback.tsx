import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type FeedbackEntry = {
  id: string;
  name: string;
  rating: number;
  comment: string;
};

type CustomerFeedbackProps = {
  rating: number;
  reviewCount: number;
};

// Mock-only feedback entries for Stage 2 UI. Replace with an
// API-sourced reviews list once the backend is connected.
const mockFeedback: FeedbackEntry[] = [
  {
    id: 'f1',
    name: 'Ayesha K.',
    rating: 5,
    comment: 'Great fabric quality and perfect fit. Loved it!',
  },
  {
    id: 'f2',
    name: 'Sana R.',
    rating: 4,
    comment: 'Looks exactly like the picture, very comfortable.',
  },
];

function stars(rating: number): string {
  return [1, 2, 3, 4, 5]
    .map(position => (rating >= position ? '★' : '☆'))
    .join('');
}

export default function CustomerFeedback({
  rating,
  reviewCount,
}: CustomerFeedbackProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Customer Feedback</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryStars}>{stars(rating)}</Text>
        <Text style={styles.summaryValue}>{rating.toFixed(1)}</Text>
        <Text style={styles.summaryCount}>{reviewCount} reviews</Text>
      </View>

      {mockFeedback.map(entry => (
        <View key={entry.id} style={styles.feedbackCard}>
          <View style={styles.feedbackHeader}>
            <Text style={styles.feedbackName}>{entry.name}</Text>
            <Text style={styles.feedbackStars}>{stars(entry.rating)}</Text>
          </View>
          <Text style={styles.feedbackComment}>{entry.comment}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.heading,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryStars: {
    color: colors.primary,
    fontSize: 16,
    marginRight: 8,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.heading,
    marginRight: 8,
  },
  summaryCount: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  feedbackCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  feedbackName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.heading,
  },
  feedbackStars: {
    fontSize: 12,
    color: colors.primary,
  },
  feedbackComment: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
});
