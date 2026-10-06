import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type ProductRatingProps = {
  rating: number;
  reviewCount: number;
};

function Stars({ rating }: { rating: number }) {
  const stars = [1, 2, 3, 4, 5].map(position => {
    if (rating >= position) {
      return '★';
    }
    if (rating >= position - 0.5) {
      return '★';
    }
    return '☆';
  });
  return <Text style={styles.stars}>{stars.join('')}</Text>;
}

export default function ProductRating({
  rating,
  reviewCount,
}: ProductRatingProps) {
  return (
    <View style={styles.row}>
      <Stars rating={rating} />
      <Text style={styles.ratingValue}>{rating.toFixed(1)}</Text>
      <Text style={styles.separator}>|</Text>
      <Text style={styles.reviewCount}>{reviewCount} Reviews</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  stars: {
    color: colors.primary,
    fontSize: 14,
    marginRight: 6,
  },
  ratingValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.heading,
    marginRight: 8,
  },
  separator: {
    color: colors.border,
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
