import React from 'react';
import { StyleSheet, View } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font'
import { Provider } from 'react-redux';

import { store } from './redux/store';
import { Router } from './routes';

function App() {
  let [fontsLoaded] = useFonts({
    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
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