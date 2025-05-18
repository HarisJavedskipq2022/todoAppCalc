import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  Main: NavigatorScreenParams<BottomTabParamList>;
  Auth: undefined;
  EditTodo: {id: string};
  Profile: undefined;
  Settings: undefined;
  CategoryDetails: {id: string; name: string};
  CategoryEdit: {id: string};
};

export type HomeStackParamList = {
  HomeFeed: undefined;
  Details: {id: string; title: string};
  CreateTodo: undefined;
  EditTodo: {id: string};
};

export type BottomTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Calendar: undefined;
  Categories: undefined;
  Stats: undefined;
  Settings: undefined;
};
