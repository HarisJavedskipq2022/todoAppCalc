import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import {RootStackParamList} from '../types/navigation';
import {useTheme} from '../utils/theme';
import useAppStore, {Todo, AppState, AppActions} from '../store/useAppStore';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';

const priorityOptions: Array<{value: Todo['priority']; label: string}> = [
  {value: 'low', label: 'Low'},
  {value: 'medium', label: 'Medium'},
  {value: 'high', label: 'High'},
];

const CreateTodoScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const addTodo = useAppStore((state: AppActions) => state.addTodo);
  const categories = useAppStore((state: AppState) => state.categories);

  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    categories[0]?.id || '',
  );
  const [selectedPriority, setSelectedPriority] =
    useState<Todo['priority']>('medium');
  const [isCompleted, setIsCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  const isFormValid = title.trim().length > 0 && selectedCategory;

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      // User dismissed the picker, do nothing or handle as needed
      return;
    }
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const showMode = (currentMode: 'date' | 'time') => {
    DateTimePickerAndroid.open({
      value: dueDate || new Date(),
      onChange: onChangeDate,
      mode: currentMode,
      is24Hour: true, // Optional, for time mode
      display: 'default', // Optional: 'default', 'spinner', 'calendar', 'clock'
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const handleCreateTodo = useCallback(() => {
    if (!isFormValid) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: title.trim(),
      category: selectedCategory,
      priority: selectedPriority,
      completed: isCompleted,
      dueDate: dueDate,
    };
    addTodo(newTodo);

    Toast.show({
      type: 'success',
      text1: 'Todo Created',
      text2: `'${newTodo.title}' has been added.`,
    });

    navigation.goBack();
  }, [
    title,
    selectedCategory,
    selectedPriority,
    isCompleted,
    dueDate,
    addTodo,
    navigation,
    isFormValid,
  ]);

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
      <View style={[styles.formGroup, {borderColor: theme.colors.border}]}>
        <Text style={[styles.label, {color: theme.colors.text}]}>
          Title <Text style={{color: theme.colors.error}}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            },
          ]}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter todo title"
          placeholderTextColor={theme.colors.placeholderText}
        />
      </View>

      <View style={[styles.formGroup, {borderColor: theme.colors.border}]}>
        <Text style={[styles.label, {color: theme.colors.text}]}>
          Category <Text style={{color: theme.colors.error}}>*</Text>
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryOption,
                {
                  backgroundColor:
                    selectedCategory === category.id
                      ? category.color
                      : theme.colors.card,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => setSelectedCategory(category.id)}>
              <View
                style={[styles.colorDot, {backgroundColor: category.color}]}
              />
              <Text
                style={[
                  styles.categoryLabel,
                  {
                    color:
                      selectedCategory === category.id
                        ? '#fff'
                        : theme.colors.text,
                  },
                ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.formGroup, {borderColor: theme.colors.border}]}>
        <Text style={[styles.label, {color: theme.colors.text}]}>Due Date</Text>
        <TouchableOpacity
          onPress={showDatepicker}
          style={[
            styles.datePickerButton,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}>
          <Text
            style={[
              styles.datePickerText,
              {
                color: dueDate
                  ? theme.colors.text
                  : theme.colors.placeholderText,
              },
            ]}>
            {dueDate ? dueDate.toLocaleDateString() : 'Select a date'}
          </Text>
          <Icon name="calendar" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.formGroup, {borderColor: theme.colors.border}]}>
        <Text style={[styles.label, {color: theme.colors.text}]}>Priority</Text>
        <View style={styles.priorityContainer}>
          {priorityOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.priorityOption,
                {
                  backgroundColor:
                    selectedPriority === option.value
                      ? option.value === 'high'
                        ? theme.colors.error
                        : option.value === 'medium'
                        ? theme.colors.warning
                        : theme.colors.info
                      : theme.colors.card,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => setSelectedPriority(option.value)}>
              <Icon
                name={
                  selectedPriority === option.value
                    ? 'check-circle'
                    : 'circle-outline'
                }
                color={
                  selectedPriority === option.value ? '#fff' : theme.colors.text
                }
                size={16}
              />
              <Text
                style={[
                  styles.priorityLabel,
                  {
                    color:
                      selectedPriority === option.value
                        ? '#fff'
                        : theme.colors.text,
                  },
                ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.formGroup, {borderColor: theme.colors.border}]}>
        <View style={styles.switchContainer}>
          <Text style={[styles.label, {color: theme.colors.text}]}>
            Mark as completed
          </Text>
          <Switch
            value={isCompleted}
            onValueChange={setIsCompleted}
            trackColor={{
              false: theme.colors.disabled,
              true: theme.colors.success,
            }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.createButton,
          {
            backgroundColor: isFormValid
              ? theme.colors.primary
              : theme.colors.disabled,
          },
        ]}
        onPress={handleCreateTodo}
        disabled={!isFormValid}>
        <Text style={styles.createButtonText}>Create Todo</Text>
      </TouchableOpacity>
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
  formGroup: {
    marginBottom: 20,
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    marginHorizontal: 4,
  },
  priorityLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  datePickerText: {
    fontSize: 16,
  },
});

export default CreateTodoScreen;
