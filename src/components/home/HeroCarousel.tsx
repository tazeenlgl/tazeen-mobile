import React, { useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import type { HeroSlide } from '../../data/heroSlides';

const { width: screenWidth } = Dimensions.get('window');
const SLIDE_WIDTH = screenWidth - 40;

type HeroCarouselProps = {
  slides: HeroSlide[];
};

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SLIDE_WIDTH);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  if (slides.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={SLIDE_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScroll}
      >
        {slides.map(slide => (
          <View
            key={slide.id}
            style={[
              styles.slide,
              { width: SLIDE_WIDTH, backgroundColor: slide.tint },
            ]}
          />
        ))}
      </ScrollView>

      <View style={styles.paginationGlass}>
        <Text style={styles.paginationText}>
          {activeIndex + 1} / {slides.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  slide: {
    height: 220,
    borderRadius: 24,
    marginRight: 0,
  },
  paginationGlass: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    backgroundColor: colors.glassDark,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  paginationText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});
