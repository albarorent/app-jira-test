import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

interface ColorPickerProps {
  selectedColor: string;
  onSelect: (color: string) => void;
}

const COLORS = ['#691085ff', '#33A1FF', '#FF5733', '#2ECC71', '#F4D03F'];

export default function ColorPicker({ selectedColor, onSelect }: ColorPickerProps) {
  return (
    <View style={styles.container}>
      {COLORS.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorCircle,
            { backgroundColor: color },
            selectedColor === color && styles.selectedCircle,
          ]}
          onPress={() => onSelect(color)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  selectedCircle: {
    borderColor: '#000',
    borderWidth: 3,
  },
});
