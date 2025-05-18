import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation';
import {useTheme} from '../utils/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AuthScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleLogin = () => {
    navigation.navigate('Main');
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Icon
        name="checkbox-marked-circle-outline"
        size={80}
        color={theme.colors.primary}
      />
      <Text style={[styles.title, {color: theme.colors.text}]}>Todo App</Text>
      <Text style={[styles.subtitle, {color: theme.colors.placeholderText}]}>
        Manage your tasks efficiently
      </Text>

      <TouchableOpacity
        style={[styles.loginButton, {backgroundColor: theme.colors.primary}]}
        onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 48,
  },
  loginButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AuthScreen;
