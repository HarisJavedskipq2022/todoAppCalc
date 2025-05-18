import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';
import {useTheme} from '../utils/theme';

type CategoryDetailsRouteProp = RouteProp<
  RootStackParamList,
  'CategoryDetails'
>;

const CategoryDetailsScreen = () => {
  const theme = useTheme();
  const route = useRoute<CategoryDetailsRouteProp>();
  const {id, name} = route.params;

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.text, {color: theme.colors.text}]}>
        Category Details: {name}
      </Text>
      <Text style={[styles.subText, {color: theme.colors.placeholderText}]}>
        ID: {id}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
  },
});

export default CategoryDetailsScreen;
