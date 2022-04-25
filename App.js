import React, { useEffect } from 'react';
import { StyleSheet, View, LogBox } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font'
import { Provider } from 'react-redux';

import { store } from './redux/store';
import { Router } from './routes';

function App() {
  console.log('App.js');
  useEffect(() => {
    LogBox.ignoreLogs(['Warning: Async Storage has been extracted from react-native core']);
  }, [])

  let [fontsLoaded] = useFonts({
    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
    'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <AppLoading />
    )
  };

  return (
    <Provider store={store}>
      <View style={styles.container}>
        <Router />
      </View>
    </Provider>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;