import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import type { Category } from '../../data/categories';
import { products } from '../../data/products';

function getCategoryImage(category: Category) {
  return products.find(product => product.id === category.imageProductId)
    ?.images?.[0];
}

type CategoryGridProps = {
  categories: Category[];
  onSelectCategory?: (category: Category) => void;
};

export default function CategoryGrid({
  categories,
  onSelectCategory,
}: CategoryGridProps) {
  return (
    <View style={styles.row}>
      {categories.map(category => {
        const imageSource = getCategoryImage(category);
        return (
          <Pressable
            key={category.id}
            style={styles.card}
            onPress={() => onSelectCategory?.(category)}
          >
            {imageSource ? (
              <Image
                source={imageSource}
                style={styles.photo}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[styles.image, { backgroundColor: category.tint }]}
              />
            )}
            <View style={styles.captionGlass}>
              <Text style={styles.captionText}>{category.name}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    width: '31.5%',
    aspectRatio: 0.78,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: {
    flex: 1,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  captionGlass: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
    backgroundColor: colors.glassSurface,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  captionText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.heading,
  },
});
