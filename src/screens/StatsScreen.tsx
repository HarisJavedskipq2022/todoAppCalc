import React, {useMemo} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {useTheme} from '../utils/theme';
import useAppStore, {AppState, Todo} from '../store/useAppStore';
import {PieChart} from 'react-native-svg-charts';
import {Text as SvgText} from 'react-native-svg';

const StatsScreen = () => {
  const theme = useTheme();
  const todos = useAppStore((state: AppState) => state.todos);

  const {completedCount, pendingCount, totalCount} = useMemo(() => {
    const completed = todos.filter((todo: Todo) => todo.completed).length;
    const total = todos.length;
    return {
      completedCount: completed,
      pendingCount: total - completed,
      totalCount: total,
    };
  }, [todos]);

  const pieData = useMemo(() => {
    if (totalCount === 0) {
      return [
        {
          key: 'empty',
          value: 1,
          svg: {fill: theme.colors.disabled},
          arc: {outerRadius: '100%', padAngle: 0},
        },
      ];
    }
    const data = [
      {
        key: 'completed',
        value: completedCount,
        svg: {fill: theme.colors.success},
        arc: {
          outerRadius: '100%',
          padAngle: completedCount > 0 && pendingCount > 0 ? 0.03 : 0,
        },
      },
      {
        key: 'pending',
        value: pendingCount,
        svg: {fill: theme.colors.warning},
        arc: {
          outerRadius: '100%',
          padAngle: completedCount > 0 && pendingCount > 0 ? 0.03 : 0,
        },
      },
    ];
    return data.filter(item => item.value > 0);
  }, [completedCount, pendingCount, totalCount, theme.colors]);

  const Labels = ({slices}: any) => {
    return slices.map((slice: any, index: number) => {
      const {pieCentroid, data} = slice;
      if (data.key === 'empty' || data.value === 0) return null;
      const percentage = ((data.value / totalCount) * 100).toFixed(0) + '%';
      return (
        <SvgText
          key={index}
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill={theme.colors.buttonText}
          textAnchor={'middle'}
          alignmentBaseline={'middle'}
          fontSize={theme.fontSize.m}
          fontWeight={'bold'}>
          {percentage}
        </SvgText>
      );
    });
  };

  const screenWidth = Dimensions.get('window').width;
  const chartSize = screenWidth * 0.7;

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.headerText, {color: theme.colors.text}]}>
        Task Progress
      </Text>
      {totalCount > 0 ? (
        <View style={styles.chartContainer}>
          <PieChart
            style={{height: chartSize, width: chartSize}}
            data={pieData}
            valueAccessor={({item}) => item.value}
            outerRadius={'95%'}
            innerRadius={'45%'}
            padAngle={0.0}>
            <Labels />
          </PieChart>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColorBox,
                  {backgroundColor: theme.colors.success},
                ]}
              />
              <Text style={[styles.legendText, {color: theme.colors.text}]}>
                Completed: {completedCount}
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendColorBox,
                  {backgroundColor: theme.colors.warning},
                ]}
              />
              <Text style={[styles.legendText, {color: theme.colors.text}]}>
                Pending: {pendingCount}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <Text style={[styles.emptyText, {color: theme.colors.placeholderText}]}>
          No tasks yet to show stats.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
  },
  legendContainer: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColorBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 16,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 50,
  },
});

export default StatsScreen;
