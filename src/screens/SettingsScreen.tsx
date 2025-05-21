import React, {useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation';
import {useTheme} from '../utils/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useAppStore, {AppState, AppActions, Profile} from '../store/useAppStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

const SettingsSection = ({title, children}: SettingsSectionProps) => {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, {color: theme.colors.primary}]}>
        {title}
      </Text>
      <View
        style={[
          styles.sectionContent,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}>
        {children}
      </View>
    </View>
  );
};

type SettingsItemProps = {
  icon: string;
  title: string;
  description?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  isDestructive?: boolean;
};

const SettingsItem = ({
  icon,
  title,
  description,
  onPress,
  rightElement,
  isDestructive = false,
}: SettingsItemProps) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={onPress}
      disabled={!onPress}>
      <View style={styles.settingsItemIcon}>
        <Icon
          name={icon}
          size={24}
          color={isDestructive ? theme.colors.error : theme.colors.primary}
        />
      </View>
      <View style={styles.settingsItemContent}>
        <Text
          style={[
            styles.settingsItemTitle,
            {color: isDestructive ? theme.colors.error : theme.colors.text},
          ]}>
          {title}
        </Text>
        {description && (
          <Text
            style={[
              styles.settingsItemDescription,
              {color: theme.colors.placeholderText},
            ]}>
            {description}
          </Text>
        )}
      </View>
      {rightElement && (
        <View style={styles.settingsItemRight}>{rightElement}</View>
      )}
    </TouchableOpacity>
  );
};

const SettingsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const profile = useAppStore((state: AppState) => state.profile);
  const toggleDarkMode = useAppStore(
    (state: AppActions) => state.toggleDarkMode,
  );
  const toggleNotifications = useAppStore(
    (state: AppActions) => state.toggleNotifications,
  );
  const updateProfile = useAppStore((state: AppActions) => state.updateProfile);

  const handleEditUsername = useCallback(() => {
    Alert.prompt(
      'Change Username',
      'Enter your new username',
      newUsername => {
        if (newUsername && newUsername.trim() !== '') {
          updateProfile({username: newUsername.trim()});
        }
      },
      'plain-text',
      profile.username,
    );
  }, [profile.username, updateProfile]);

  const handleDarkModeToggle = useCallback(() => {
    toggleDarkMode();
  }, [toggleDarkMode]);

  const handleNotificationsToggle = useCallback(() => {
    toggleNotifications();
  }, [toggleNotifications]);

  const handleExportData = useCallback(() => {
    Alert.alert(
      'Export Data',
      'This would export all your todo data to a file.',
      [{text: 'OK'}],
    );
  }, []);

  const handleImportData = useCallback(() => {
    Alert.alert(
      'Import Data',
      'This would allow you to import todo data from a file.',
      [{text: 'OK'}],
    );
  }, []);

  const handleClearData = useCallback(() => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all your data? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: () => {
            // This would clear all data
            Alert.alert('Data Cleared', 'All your data has been cleared.');
          },
        },
      ],
    );
  }, []);

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
      contentContainerStyle={styles.contentContainer}>
      <SettingsSection title="Account">
        <SettingsItem
          icon="account"
          title="Username"
          description={profile.username}
          onPress={handleEditUsername}
          rightElement={
            <Icon name="pencil" size={20} color={theme.colors.primary} />
          }
        />
        <SettingsItem
          icon="email"
          title="Email"
          description="Not set"
          onPress={() => {}}
          rightElement={
            <Icon name="plus" size={20} color={theme.colors.primary} />
          }
        />
      </SettingsSection>

      <SettingsSection title="Preferences">
        <SettingsItem
          icon="theme-light-dark"
          title="Dark Mode"
          description="Use dark theme"
          rightElement={
            <Switch
              value={profile.preferences.darkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{
                false: theme.colors.disabled,
                true: theme.colors.primary,
              }}
              thumbColor="#ffffff"
            />
          }
        />
        <SettingsItem
          icon="bell"
          title="Notifications"
          description="Enable notifications"
          rightElement={
            <Switch
              value={profile.preferences.notifications}
              onValueChange={handleNotificationsToggle}
              trackColor={{
                false: theme.colors.disabled,
                true: theme.colors.primary,
              }}
              thumbColor="#ffffff"
            />
          }
        />
      </SettingsSection>

      <SettingsSection title="Data">
        <SettingsItem
          icon="export"
          title="Export Data"
          description="Save your todos to a file"
          onPress={handleExportData}
        />
        <SettingsItem
          icon="import"
          title="Import Data"
          description="Load todos from a file"
          onPress={handleImportData}
        />
        <SettingsItem
          icon="delete"
          title="Clear All Data"
          description="Remove all todos and categories"
          onPress={handleClearData}
          isDestructive
        />
      </SettingsSection>

      <SettingsSection title="About">
        <SettingsItem icon="information" title="Version" description="1.0.0" />
        <SettingsItem icon="license" title="Licenses" onPress={() => {}} />
        <SettingsItem
          icon="help-circle"
          title="Help & Support"
          onPress={() => {}}
        />
      </SettingsSection>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 8,
    textTransform: 'uppercase',
  },
  sectionContent: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  settingsItemIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingsItemDescription: {
    fontSize: 14,
  },
  settingsItemRight: {
    marginLeft: 8,
  },
});

export default SettingsScreen;
