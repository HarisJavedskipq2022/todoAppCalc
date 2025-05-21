import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import useAppStore, {AppActions, AppState} from '../store/useAppStore';
import {HomeStackParamList} from '../types/navigation';
import {useTheme} from '../utils/theme';

type EditTodoRouteProp = RouteProp<HomeStackParamList, 'EditTodo'>;
type EditTodoNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'EditTodo'
>;

const EditTodoScreen = () => {
  const theme = useTheme();
  const route = useRoute<EditTodoRouteProp>();
  const navigation = useNavigation<EditTodoNavigationProp>();
  const insets = useSafeAreaInsets();
  const {id} = route.params;

  const todo = useAppStore((state: AppState) =>
    state.todos.find(t => t.id === id),
  );
  const updateTodo = useAppStore((state: AppActions) => state.updateTodo);

  const [title, setTitle] = useState('');

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
    }
  }, [todo]);

  const handleSaveChanges = useCallback(() => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title cannot be empty.');
      return;
    }
    if (todo) {
      updateTodo(id, {title});
      Toast.show({
        type: 'success',
        text1: 'Todo Updated',
        text2: `'${title}' has been updated.`,
      });
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Todo not found. Cannot update.');
    }
  }, [id, title, todo, updateTodo, navigation]);

  if (!todo) {
    return (
      <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <Text style={[styles.text, {color: theme.colors.error}]}>
          Todo not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
      contentContainerStyle={styles.contentContainer}>
      <Text style={[styles.label, {color: theme.colors.text}]}>Title</Text>
      <TextInput
        style={[
          styles.input,
          {
            color: theme.colors.text,
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter todo title"
        placeholderTextColor={theme.colors.placeholderText}
      />
      {/* Add more input fields here */}

      <TouchableOpacity
        style={[styles.saveButton, {backgroundColor: theme.colors.primary}]}
        onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    // For error or loading messages
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  // subText: { // Kept if needed for other things, but not used in this version
  //   fontSize: 14,
  // },
  contentContainer: {
    flexGrow: 1,
  },
});

export default EditTodoScreen;
