import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  category: string;
};

export type Profile = {
  username: string;
  avatar?: string;
  preferences: {
    darkMode: boolean;
    notifications: boolean;
  };
};

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type AppState = {
  todos: Todo[];
  categories: Category[];
  profile: Profile;
  activeCategory: string | null;
  isLoading: boolean;
  error: string | null;
};

export type AppActions = {
  addTodo: (todo: Omit<Todo, 'id'>) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodoStatus: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  setActiveCategory: (id: string | null) => void;
  updateProfile: (profile: Partial<Profile>) => void;
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

const useAppStore = create<AppState & AppActions>()(
  immer(set => ({
    todos: [],
    categories: [
      {id: '1', name: 'Work', color: '#FF5733'},
      {id: '2', name: 'Personal', color: '#33FF57'},
      {id: '3', name: 'Shopping', color: '#3357FF'},
    ],
    profile: {
      username: 'User',
      preferences: {
        darkMode: false,
        notifications: true,
      },
    },
    activeCategory: null,
    isLoading: false,
    error: null,

    addTodo: todo =>
      set(state => {
        const newTodoWithId = {
          ...todo,
          id: Math.random().toString(36).substr(2, 9),
        };
        state.todos.push(newTodoWithId);
      }),

    updateTodo: (id, updatedTodo) =>
      set(state => {
        const index = state.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
          state.todos[index] = {...state.todos[index], ...updatedTodo};
        }
      }),

    deleteTodo: id =>
      set(state => {
        state.todos = state.todos.filter(todo => todo.id !== id);
      }),

    toggleTodoStatus: id =>
      set(state => {
        const index = state.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
          state.todos[index].completed = !state.todos[index].completed;
        }
      }),

    addCategory: category =>
      set(state => {
        state.categories.push({
          ...category,
          id: Math.random().toString(36).substr(2, 9),
        });
      }),

    deleteCategory: id =>
      set(state => {
        state.categories = state.categories.filter(
          category => category.id !== id,
        );
      }),

    setActiveCategory: id =>
      set(state => {
        state.activeCategory = id;
      }),

    updateProfile: profileUpdates =>
      set(state => {
        state.profile = {...state.profile, ...profileUpdates};
      }),

    toggleDarkMode: () =>
      set(state => {
        state.profile.preferences.darkMode =
          !state.profile.preferences.darkMode;
      }),

    toggleNotifications: () =>
      set(state => {
        state.profile.preferences.notifications =
          !state.profile.preferences.notifications;
      }),

    setLoading: isLoading =>
      set(state => {
        state.isLoading = isLoading;
      }),

    setError: error =>
      set(state => {
        state.error = error;
      }),
  })),
);

export default useAppStore;
