import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStackParamList} from '../types/navigation';
import {useTheme} from '../utils/theme';
import useAppStore, {
  AppState,
  AppActions,
  Category,
  Todo,
} from '../store/useAppStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type CategoryItemProps = {
  id: string;
  name: string;
  color: string;
  todosCount: number;
  onPress: (id: string, name: string) => void;
  onLongPress: (id: string) => void;
  isActive: boolean;
};

const CategoryItem = ({
  id,
  name,
  color,
  todosCount,
  onPress,
  onLongPress,
  isActive,
}: CategoryItemProps) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        {
          backgroundColor: theme.colors.card,
          borderColor: isActive ? theme.colors.primary : theme.colors.border,
          borderWidth: isActive ? 2 : 1,
        },
      ]}
      onPress={() => onPress(id, name)}
      onLongPress={() => onLongPress(id)}
      activeOpacity={0.7}>
      <View style={[styles.colorIndicator, {backgroundColor: color}]} />
      <View style={styles.categoryContent}>
        <Text style={[styles.categoryName, {color: theme.colors.text}]}>
          {name}
        </Text>
        <Text
          style={[styles.categoryCount, {color: theme.colors.placeholderText}]}>
          {todosCount} {todosCount === 1 ? 'task' : 'tasks'}
        </Text>
      </View>
      <Icon name="chevron-right" size={20} color={theme.colors.text} />
    </TouchableOpacity>
  );
};

const AddCategoryInput = ({
  onAdd,
}: {
  onAdd: (name: string, color: string) => void;
}) => {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#4361EE');

  const colors = [
    '#4361EE',
    '#3A86FF',
    '#00C9A7',
    '#FFC300',
    '#FF5733',
    '#C70039',
    '#900C3F',
    '#8338EC',
    '#FB5607',
    '#06D6A0',
  ];

  const handleAdd = () => {
    if (name.trim().length === 0) {
      return;
    }

    onAdd(name.trim(), selectedColor);
    setName('');
  };

  return (
    <View
      style={[
        styles.addCategoryContainer,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}>
      <TextInput
        style={[styles.input, {color: theme.colors.text}]}
        placeholder="New category name"
        placeholderTextColor={theme.colors.placeholderText}
        value={name}
        onChangeText={setName}
        onSubmitEditing={handleAdd}
        returnKeyType="done"
      />

      <View style={styles.colorPicker}>
        {colors.map(color => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorOption,
              {backgroundColor: color},
              selectedColor === color && styles.selectedColor,
            ]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.addButton, {backgroundColor: theme.colors.primary}]}
        onPress={handleAdd}
        disabled={name.trim().length === 0}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const CategoriesScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const categories = useAppStore((state: AppState) => state.categories);
  const todos = useAppStore((state: AppState) => state.todos);
  const activeCategory = useAppStore((state: AppState) => state.activeCategory);
  const addCategory = useAppStore((state: AppActions) => state.addCategory);
  const deleteCategory = useAppStore(
    (state: AppActions) => state.deleteCategory,
  );
  const setActiveCategory = useAppStore(
    (state: AppActions) => state.setActiveCategory,
  );

  const categoriesWithCount = useMemo(() => {
    return categories.map((category: Category) => ({
      ...category,
      todosCount: todos.filter((todo: Todo) => todo.category === category.id)
        .length,
    }));
  }, [categories, todos]);

  const handleCategoryPress = useCallback(
    (id: string) => {
      if (activeCategory === id) {
        setActiveCategory(null);
      } else {
        setActiveCategory(id);
      }
    },
    [activeCategory, setActiveCategory],
  );

  const handleAddCategory = useCallback(
    (name: string, color: string) => {
      addCategory({name, color});
    },
    [addCategory],
  );

  const handleLongPress = useCallback(
    (id: string) => {
      Alert.alert(
        'Delete Category',
        'Are you sure you want to delete this category? All associated todos will be unlinked.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Delete',
            onPress: () => deleteCategory(id),
            style: 'destructive',
          },
        ],
      );
    },
    [deleteCategory],
  );

  const handleAllCategories = useCallback(() => {
    setActiveCategory(null);
  }, [setActiveCategory]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, {color: theme.colors.text}]}>
          Categories
        </Text>
        <TouchableOpacity
          style={[
            styles.allCategoriesButton,
            {
              backgroundColor:
                activeCategory === null
                  ? theme.colors.primary
                  : theme.colors.background,
              borderColor: theme.colors.primary,
            },
          ]}
          onPress={handleAllCategories}>
          <Text
            style={[
              styles.allCategoriesText,
              {
                color:
                  activeCategory === null
                    ? theme.colors.buttonText
                    : theme.colors.primary,
              },
            ]}>
            All
          </Text>
        </TouchableOpacity>
      </View>

      <AddCategoryInput onAdd={handleAddCategory} />

      <FlatList
        data={categoriesWithCount}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <CategoryItem
            id={item.id}
            name={item.name}
            color={item.color}
            todosCount={item.todosCount}
            onPress={handleCategoryPress}
            onLongPress={handleLongPress}
            isActive={activeCategory === item.id}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
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
  allCategoriesButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  allCategoriesText: {
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
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
  colorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
  },
  addCategoryContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    margin: 16,
    marginTop: 0,
  },
  input: {
    fontSize: 16,
    paddingVertical: 8,
    marginBottom: 12,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  colorOption: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#fff',
    transform: [{scale: 1.2}],
  },
  addButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default CategoriesScreen;
