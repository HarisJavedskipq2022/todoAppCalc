import React, {useCallback, useMemo, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {HomeStackParamList} from '../types/navigation';
import {useTheme} from '../utils/theme';
import useAppStore, {AppState, AppActions, Todo} from '../store/useAppStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type TodoItemProps = {
  id: string;
  title: string;
  completed: boolean;
  priority: string;
  category: string;
  onToggle: (id: string) => void;
  onPress: (id: string, title: string) => void;
};

const TodoItem = ({
  id,
  title,
  completed,
  priority,
  category,
  onToggle,
  onPress,
}: TodoItemProps) => {
  const theme = useTheme();
  const categories = useAppStore(state => state.categories);

  const categoryObj = categories.find(cat => cat.id === category);
  const categoryColor = categoryObj?.color || theme.colors.primary;

  const priorityColors = {
    low: theme.colors.info,
    medium: theme.colors.warning,
    high: theme.colors.error,
  };

  return (
    <TouchableOpacity
      style={[
        styles.todoItem,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={() => onPress(id, title)}>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => onToggle(id)}>
        <View
          style={[
            styles.checkbox,
            {
              borderColor: theme.colors.primary,
              backgroundColor: completed ? theme.colors.primary : 'transparent',
            },
          ]}>
          {completed && <Icon name="check" size={16} color="#fff" />}
        </View>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.text,
              textDecorationLine: completed ? 'line-through' : 'none',
              opacity: completed ? 0.7 : 1,
            },
          ]}
          numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.metaContainer}>
          <View
            style={[styles.categoryBadge, {backgroundColor: categoryColor}]}>
            <Text style={styles.categoryText}>
              {categoryObj?.name || 'General'}
            </Text>
          </View>

          <View
            style={[
              styles.priorityIndicator,
              {
                backgroundColor:
                  priorityColors[priority as keyof typeof priorityColors] ||
                  theme.colors.info,
              },
            ]}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.moreButton}>
        <Icon name="dots-vertical" size={20} color={theme.colors.text} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const HomeScreen = () => {
  const theme = useTheme();
  const navigation =
    useNavigation<StackNavigationProp<HomeStackParamList, 'HomeFeed'>>();
  const insets = useSafeAreaInsets();

  const todos = useAppStore((state: AppState) => state.todos);
  const activeCategory = useAppStore((state: AppState) => state.activeCategory);
  const toggleTodoStatus = useAppStore(
    (state: AppActions) => state.toggleTodoStatus,
  );

  useEffect(() => {
    console.log(
      '[HomeScreen] Received todos from store:',
      JSON.stringify(todos, null, 2),
    );
    console.log('[HomeScreen] Active category:', activeCategory);
  }, [todos, activeCategory]);

  const filteredTodos = useMemo(() => {
    const result = activeCategory
      ? todos.filter((todo: Todo) => todo.category === activeCategory)
      : todos;
    console.log(
      '[HomeScreen] Filtered todos:',
      JSON.stringify(result, null, 2),
    );
    return result;
  }, [activeCategory, todos]);

  const handleToggleTodo = useCallback(
    (id: string) => {
      toggleTodoStatus(id);
    },
    [toggleTodoStatus],
  );

  const handleTodoPress = useCallback(
    (id: string, title: string) => {
      navigation.navigate('Details', {id, title});
    },
    [navigation],
  );

  const handleAddTodo = useCallback(() => {
    navigation.navigate('CreateTodo');
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={[
            styles.addButton,
            {backgroundColor: theme.colors.primary, marginRight: 16},
          ]}
          onPress={handleAddTodo}>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleAddTodo, theme.colors.primary]);

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
      {filteredTodos.length > 0 ? (
        <FlatList
          data={filteredTodos}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TodoItem
              id={item.id}
              title={item.title}
              completed={item.completed}
              priority={item.priority}
              category={item.category}
              onToggle={handleToggleTodo}
              onPress={handleTodoPress}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon
            name="clipboard-text-outline"
            size={80}
            color={theme.colors.disabled}
          />
          <Text style={[styles.emptyText, {color: theme.colors.disabled}]}>
            No tasks yet
          </Text>
          <TouchableOpacity
            style={[
              styles.emptyButton,
              {backgroundColor: theme.colors.primary},
            ]}
            onPress={handleAddTodo}>
            <Text style={styles.emptyButtonText}>Add your first task</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  priorityIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  moreButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HomeScreen;
