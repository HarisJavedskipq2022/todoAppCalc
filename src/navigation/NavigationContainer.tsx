import {NavigationContainer as RNNavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Platform, StatusBar} from 'react-native';
import Toast from 'react-native-toast-message';
import AuthScreen from '../screens/AuthScreen';
import CategoryDetailsScreen from '../screens/CategoryDetailsScreen';
import CategoryEditScreen from '../screens/CategoryEditScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import {RootStackParamList} from '../types/navigation';
import {useTheme} from '../utils/theme';
import MainTabs from './MainTabs';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigationContainer = () => {
  const theme = useTheme();

  const WEB_FONT_STACK =
    'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

  return (
    <>
      <RNNavigationContainer
        theme={{
          dark: theme.isDark,
          colors: {
            primary: theme.colors.primary,
            background: theme.colors.background,
            card: theme.colors.card,
            text: theme.colors.text,
            border: theme.colors.border,
            notification: theme.colors.notification,
          },
          fonts: Platform.select({
            web: {
              regular: {
                fontFamily: WEB_FONT_STACK,
                fontWeight: '400',
              },
              medium: {
                fontFamily: WEB_FONT_STACK,
                fontWeight: '500',
              },
              bold: {
                fontFamily: WEB_FONT_STACK,
                fontWeight: '600',
              },
              heavy: {
                fontFamily: WEB_FONT_STACK,
                fontWeight: '700',
              },
            },
            ios: {
              regular: {
                fontFamily: 'System',
                fontWeight: '400',
              },
              medium: {
                fontFamily: 'System',
                fontWeight: '500',
              },
              bold: {
                fontFamily: 'System',
                fontWeight: '600',
              },
              heavy: {
                fontFamily: 'System',
                fontWeight: '700',
              },
            },
            default: {
              regular: {
                fontFamily: 'sans-serif',
                fontWeight: 'normal',
              },
              medium: {
                fontFamily: 'sans-serif-medium',
                fontWeight: 'normal',
              },
              bold: {
                fontFamily: 'sans-serif',
                fontWeight: '600',
              },
              heavy: {
                fontFamily: 'sans-serif',
                fontWeight: '700',
              },
            },
          }),
        }}>
        <StatusBar
          barStyle={theme.isDark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        <Stack.Navigator
          initialRouteName="Main"
          screenOptions={{
            headerShown: false,
            cardStyle: {backgroundColor: theme.colors.background},
          }}>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: 'Profile',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              title: 'Settings',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="CategoryDetails"
            component={CategoryDetailsScreen}
            options={({route}) => ({
              title: route.params.name,
              headerShown: true,
            })}
          />
          <Stack.Screen
            name="CategoryEdit"
            component={CategoryEditScreen}
            options={{
              title: 'Edit Category',
              headerShown: true,
            }}
          />
        </Stack.Navigator>
      </RNNavigationContainer>
      <Toast />
    </>
  );
};

export default AppNavigationContainer;
