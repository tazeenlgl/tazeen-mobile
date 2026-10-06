import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';

type FaceGuideProps = {
  isValid: boolean;
};

// Purely decorative oval overlay guiding where to position the face.
export default function FaceGuide({ isValid }: FaceGuideProps) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.wrapper}>
        <View style={[styles.oval, isValid && styles.ovalValid]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oval: {
    width: 240,
    height: 320,
    borderRadius: 160,
    borderWidth: 3,
    borderColor: colors.glassBorder,
  },
  ovalValid: {
    borderColor: colors.primary,
  },
});
