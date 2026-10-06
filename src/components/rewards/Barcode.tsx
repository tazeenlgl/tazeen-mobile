import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { encodeCode128 } from '../../utils/barcode128';

type BarcodeProps = {
  value: string;
  height?: number;
  unitWidth?: number;
  barColor?: string;
};

export default function Barcode({
  value,
  height = 44,
  unitWidth = 2,
  barColor = '#1A1A1A',
}: BarcodeProps) {
  const widths = useMemo(() => encodeCode128(value), [value]);

  return (
    <View style={styles.row}>
      {widths.map((units, index) => (
        <View
          key={index}
          style={{
            width: units * unitWidth,
            height,
            // Pattern always starts with a bar at even indices.
            backgroundColor: index % 2 === 0 ? barColor : 'transparent',
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});
