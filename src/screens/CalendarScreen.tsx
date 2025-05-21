import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useMemo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Calendar, CalendarProps} from 'react-native-calendars';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useAppStore, {AppState, Todo} from '../store/useAppStore';
import {BottomTabParamList} from '../types/navigation';
import {useTheme} from '../utils/theme';

interface DayMarking {
  dots?: Array<{key: string; color: string; selectedDotColor?: string}>;
  marked?: boolean;
  selected?: boolean;
  selectedColor?: string;
  activeOpacity?: number;
  disabled?: boolean;
  disableTouchEvent?: boolean;
  dotColor?: string;
}

type CustomMarkedDates = {[dateString: string]: DayMarking};

type CalendarNavigationProp = StackNavigationProp<BottomTabParamList>;

const CalendarScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<CalendarNavigationProp>();
  const todos = useAppStore((state: AppState) => state.todos);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const markedDates: CustomMarkedDates = useMemo(() => {
    const marks: CustomMarkedDates = {};
    todos.forEach((todo: Todo) => {
      if (todo.dueDate) {
        const dateString = new Date(todo.dueDate).toISOString().split('T')[0];
        if (marks[dateString]) {
          marks[dateString].dots = [
            ...(marks[dateString].dots || []),
            {
              key: todo.id,
              color: theme.colors.primary,
              selectedDotColor: 'white',
            },
          ];
        } else {
          marks[dateString] = {
            marked: true,
            dots: [
              {
                key: todo.id,
                color: theme.colors.primary,
                selectedDotColor: 'white',
              },
            ],
          };
        }
      }
    });
    if (selectedDate && marks[selectedDate]) {
      marks[selectedDate].selected = true;
      marks[selectedDate].selectedColor = theme.colors.primary;
    } else if (selectedDate) {
      marks[selectedDate] = {
        selected: true,
        selectedColor: theme.colors.primary,
        marked: false,
      };
    }
    return marks;
  }, [todos, theme.colors.primary, selectedDate]);

  const selectedDayTodos = useMemo(() => {
    if (!selectedDate) return [];
    return todos.filter(
      (todo: Todo) =>
        todo.dueDate &&
        new Date(todo.dueDate).toISOString().split('T')[0] === selectedDate,
    );
  }, [selectedDate, todos]);

  const handleDayPress: CalendarProps['onDayPress'] = day => {
    if (selectedDate === day.dateString) {
      setSelectedDate(null);
    } else {
      setSelectedDate(day.dateString);
    }
  };

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
      ]}>
      <Calendar
        style={styles.calendar}
        current={new Date().toISOString().split('T')[0]}
        markedDates={markedDates}
        markingType={'multi-dot'}
        onDayPress={handleDayPress}
        theme={{
          backgroundColor: theme.colors.background,
          calendarBackground: theme.colors.card,
          textSectionTitleColor: theme.colors.text,
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: '#ffffff',
          todayTextColor: theme.colors.primary,
          dayTextColor: theme.colors.text,
          textDisabledColor: theme.colors.disabled,
          dotColor: theme.colors.primary,
          selectedDotColor: '#ffffff',
          arrowColor: theme.colors.primary,
          disabledArrowColor: theme.colors.disabled,
          monthTextColor: theme.colors.primary,
          indicatorColor: theme.colors.primary,
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: theme.fontSize.s,
          textMonthFontSize: theme.fontSize.m,
          textDayHeaderFontSize: theme.fontSize.s,
          agendaDayTextColor: theme.colors.primary,
          agendaDayNumColor: theme.colors.primary,
          agendaTodayColor: theme.colors.primary,
          agendaKnobColor: theme.colors.primary,
        }}
      />
      {selectedDate && (
        <View style={styles.todoListContainer}>
          <Text style={[styles.selectedDateText, {color: theme.colors.text}]}>
            Tasks for {selectedDate}:
          </Text>
          {selectedDayTodos.length > 0 ? (
            selectedDayTodos.map(todo => (
              <TouchableOpacity
                key={todo.id}
                style={[
                  styles.todoItem,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() =>
                  navigation.navigate('Home', {
                    screen: 'Details',
                    params: {id: todo.id, title: todo.title},
                  })
                }>
                <Text
                  style={[styles.todoItemTitle, {color: theme.colors.text}]}>
                  {todo.title}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text
              style={[
                styles.emptyDayText,
                {color: theme.colors.placeholderText},
              ]}>
              No tasks for this day.
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendar: {
    borderRadius: 8,
    margin: 16,
    paddingBottom: 8,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 16,
  },
  todoListContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  todoItem: {
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
  },
  todoItemTitle: {
    fontSize: 16,
  },
  emptyDayText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default CalendarScreen;
