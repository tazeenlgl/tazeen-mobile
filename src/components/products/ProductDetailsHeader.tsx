import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { colors } from '../../theme/colors';

const { width: screenWidth } = Dimensions.get('window');
// Matches the scroll content's horizontal padding (see ProductDetailsScreen).
const SLOT_WIDTH = screenWidth - 40;

type ProductDetailsHeaderProps = {
  // Real local gallery images, when the product has them. Falls back to
  // the `imageTint` color block (used by every mock product without
  // real assets) when omitted or empty.
  images: ImageSourcePropType[];
  imageTint: string;
};

export default function ProductDetailsHeader({
  images,
  imageTint,
}: ProductDetailsHeaderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <View style={styles.wrapper}>
        <View style={[styles.image, { backgroundColor: imageTint }]} />
      </View>
    );
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SLOT_WIDTH);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      >
        {images.map((source, index) => (
          <Image
            key={index}
            source={source}
            style={[styles.image, { width: SLOT_WIDTH }]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {images.length > 1 && (
        <View style={styles.dots}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  image: {
    width: '100%',
    aspectRatio: 1.05,
    borderRadius: 20,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 16,
  },
});
