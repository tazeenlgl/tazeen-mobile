import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type KeyFeaturesProps = {
  features: string[];
};

export default function KeyFeatures({ features }: KeyFeaturesProps) {
  if (features.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Key Features</Text>
      {features.map(feature => (
        <View key={feature} style={styles.row}>
          <Text style={styles.bullet}>{'•'}</Text>
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.heading,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bullet: {
    color: colors.primary,
    fontSize: 14,
    marginRight: 8,
  },
  featureText: {
    fontSize: 13,
    color: colors.heading,
    flexShrink: 1,
    lineHeight: 19,
  },
});
