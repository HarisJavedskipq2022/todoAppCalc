import {RouteProp} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React from 'react';
import {HomeStackParamList} from '../types/navigation';
import {useTheme} from '../utils/theme';

import CreateTodoScreen from '../screens/CreateTodoScreen';
import EditTodoScreen from '../screens/EditTodoScreen';
import HomeScreen from '../screens/HomeScreen';
import TodoDetailsScreen from '../screens/TodoDetailsScreen';

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  const theme = useTheme();

  const screenOptions: StackNavigationOptions = {
    headerStyle: {
      backgroundColor: theme.colors.card,
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTintColor: theme.colors.primary,
    headerTitleStyle: {
      color: theme.colors.text,
      fontSize: theme.fontSize.l,
    },
    cardStyle: {backgroundColor: theme.colors.background},
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="HomeFeed"
        component={HomeScreen}
        options={{title: 'My Tasks'}}
      />
      <Stack.Screen
        name="Details"
        component={TodoDetailsScreen}
        options={({
          route,
        }: {
          route: RouteProp<HomeStackParamList, 'Details'>;
        }) => ({
          title: route.params.title,
        })}
      />
      <Stack.Screen
        name="CreateTodo"
        component={CreateTodoScreen}
        options={{
          title: 'Create New Todo',
        }}
      />
      <Stack.Screen
        name="EditTodo"
        component={EditTodoScreen}
        options={({
          route,
        }: {
          route: RouteProp<HomeStackParamList, 'EditTodo'>;
        }) => ({
          title: 'Edit Todo',
        })}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
