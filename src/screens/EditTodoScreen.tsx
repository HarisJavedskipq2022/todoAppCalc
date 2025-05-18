import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {HomeStackParamList} from '../types/navigation';
import Toast from 'react-native-toast-message';
import {useTheme} from '../utils/theme';
import useAppStore, {AppState, AppActions, Todo} from '../store/useAppStore';
import {StackNavigationProp} from '@react-navigation/stack';

type EditTodoRouteProp = RouteProp<HomeStackParamList, 'EditTodo'>;
type EditTodoNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'EditTodo'
>;

const EditTodoScreen = () => {
  const theme = useTheme();
  const route = useRoute<EditTodoRouteProp>();
  const navigation = useNavigation<EditTodoNavigationProp>();
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
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
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
    </View>
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
});

export default EditTodoScreen;
