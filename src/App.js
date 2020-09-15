import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Router from './router';
import FlashMessage from 'react-native-flash-message';
import {Loading} from './components';
import {Provider, useSelector} from 'react-redux';
import store from './redux/store';
import {LogBox} from 'react-native';

const MainApp = () => {
  const stateGlobal = useSelector((state) => state);
  // console.log(stateGlobal);
  // YellowBox.ignoreWarnings(['Setting a timer']);
  LogBox.ignoreLogs([
    'Setting a timer',
    'Warning: Async Storage has been extracted from react-native core',
    'FIREBASE WARNING: Using an unspecified index',
  ]);
  // LogBox.ignoreAllLogs();
  return (
    <>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
      <FlashMessage postion="top" />
      {stateGlobal.loading && <Loading />}
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
};

export default App;
