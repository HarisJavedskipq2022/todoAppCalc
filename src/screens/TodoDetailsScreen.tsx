import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useMemo} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useAppStore, {
  AppActions,
  AppState,
  Category,
  Todo,
} from '../store/useAppStore';
import {HomeStackParamList} from '../types/navigation';
import {useTheme} from '../utils/theme';

type TodoDetailsRouteProp = RouteProp<HomeStackParamList, 'Details'>;

const priorityLabels = {
  low: 'Low Priority',
  medium: 'Medium Priority',
  high: 'High Priority',
};

const priorityIcons = {
  low: 'flag-outline',
  medium: 'flag-variant',
  high: 'flag',
};

const TodoDetailsScreen = () => {
  const theme = useTheme();
  const route = useRoute<TodoDetailsRouteProp>();
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const {id} = route.params;
  const insets = useSafeAreaInsets();

  const todos = useAppStore((state: AppState) => state.todos);
  const categories = useAppStore((state: AppState) => state.categories);
  const toggleTodoStatus = useAppStore(
    (state: AppActions) => state.toggleTodoStatus,
  );
  const deleteTodo = useAppStore((state: AppActions) => state.deleteTodo);

  const todo = useMemo(() => {
    return todos.find((t: Todo) => t.id === id);
  }, [todos, id]);

  const categoryInfo = useMemo(() => {
    if (!todo?.category) return undefined;
    return categories.find((c: Category) => c.id === todo.category);
  }, [categories, todo]);

  const handleToggleStatus = useCallback(() => {
    if (todo) {
      toggleTodoStatus(todo.id);
    }
  }, [todo, toggleTodoStatus]);

  const handleEdit = useCallback(() => {
    navigation.navigate('EditTodo', {id});
  }, [navigation, id]);

  const handleDelete = useCallback(() => {
    Alert.alert('Delete Todo', 'Are you sure you want to delete this todo?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (todo) {
            deleteTodo(todo.id);
            navigation.goBack();
          }
        },
      },
    ]);
  }, [todo, deleteTodo, navigation]);

  if (!todo) {
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
        <Text style={[styles.errorText, {color: theme.colors.error}]}>
          Todo not found
        </Text>
      </View>
    );
  }

  const formattedDate = todo.dueDate
    ? new Date(todo.dueDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'No due date';

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
      <View style={styles.header}>
        <View
          style={[
            styles.statusContainer,
            {
              backgroundColor: todo.completed
                ? theme.colors.success
                : theme.colors.primary,
            },
          ]}>
          <Icon
            name={todo.completed ? 'check-circle' : 'circle-outline'}
            size={24}
            color="#fff"
          />
          <Text style={styles.statusText}>
            {todo.completed ? 'Completed' : 'Active'}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}>
        <Text style={[styles.title, {color: theme.colors.text}]}>
          {todo.title}
        </Text>

        <View style={styles.metaRow}>
          <View
            style={[
              styles.metaItem,
              {backgroundColor: theme.colors.background},
            ]}>
            <Icon name="calendar" size={20} color={theme.colors.primary} />
            <Text style={[styles.metaText, {color: theme.colors.text}]}>
              {formattedDate}
            </Text>
          </View>

          <View
            style={[
              styles.metaItem,
              {backgroundColor: theme.colors.background},
            ]}>
            <Icon
              name={priorityIcons[todo.priority as keyof typeof priorityIcons]}
              size={20}
              color={
                todo.priority === 'high'
                  ? theme.colors.error
                  : todo.priority === 'medium'
                  ? theme.colors.warning
                  : theme.colors.info
              }
            />
            <Text style={[styles.metaText, {color: theme.colors.text}]}>
              {priorityLabels[todo.priority as keyof typeof priorityLabels]}
            </Text>
          </View>
        </View>

        {categoryInfo && (
          <View style={styles.categoryContainer}>
            <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
              Category
            </Text>
            <View
              style={[
                styles.categoryBadge,
                {backgroundColor: categoryInfo.color},
              ]}>
              <Text style={styles.categoryText}>{categoryInfo.name}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: todo.completed
                ? theme.colors.warning
                : theme.colors.success,
            },
          ]}
          onPress={handleToggleStatus}>
          <Icon
            name={todo.completed ? 'undo' : 'check'}
            size={24}
            color="#fff"
          />
          <Text style={styles.actionButtonText}>
            {todo.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: theme.colors.primary}]}
          onPress={handleEdit}>
          <Icon name="pencil" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: theme.colors.error}]}
          onPress={handleDelete}>
          <Icon name="delete" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  metaText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  categoryText: {
    color: '#fff',
    fontWeight: '600',
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 24,
  },
});

export default TodoDetailsScreen;
