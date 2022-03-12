import React from 'react';
import { StyleSheet, View } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font'
import { Provider } from 'react-redux';

import Main from './components/Main';
import { store } from './redux/store';

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
        <Main />
      </View>
    </Provider>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    fontFamily: 'Roboto',
  },
});

export default App;