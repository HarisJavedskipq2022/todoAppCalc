import React from 'react';
import {useRoute, RouteProp} from '@react-navigation/native';
import {View, Text, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}>
      <Text style={[styles.title, {color: theme.colors.text}]}>
        Category Details: {name}
      </Text>
      <Text style={[styles.id, {color: theme.colors.placeholderText}]}>
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
  title: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  id: {
    fontSize: 14,
  },
});

export default CategoryDetailsScreen;
