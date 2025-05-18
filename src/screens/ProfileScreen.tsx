import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation';
import {useTheme} from '../utils/theme';
import useAppStore from '../store/useAppStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {profile} = useAppStore();

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View
        style={[styles.profileHeader, {backgroundColor: theme.colors.card}]}>
        <View style={styles.avatarContainer}>
          {profile.avatar ? (
            <Image source={{uri: profile.avatar}} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                {backgroundColor: theme.colors.primary},
              ]}>
              <Text style={styles.avatarInitial}>
                {profile.username.substring(0, 1).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <Text style={[styles.username, {color: theme.colors.text}]}>
          {profile.username}
        </Text>

        <TouchableOpacity
          style={[styles.editButton, {backgroundColor: theme.colors.primary}]}
          onPress={() => {
            /* Edit profile action */
          }}>
          <Icon name="pencil" size={16} color="#fff" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.statsContainer,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, {color: theme.colors.text}]}>0</Text>
          <Text
            style={[styles.statLabel, {color: theme.colors.placeholderText}]}>
            Tasks Completed
          </Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={[styles.statValue, {color: theme.colors.text}]}>0</Text>
          <Text
            style={[styles.statLabel, {color: theme.colors.placeholderText}]}>
            Tasks Pending
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
        Profile Content - Coming Soon
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    padding: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    padding: 16,
    textAlign: 'center',
  },
});

export default ProfileScreen;
