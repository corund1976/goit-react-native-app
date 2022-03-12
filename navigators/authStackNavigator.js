import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RegisterScreen, LoginScreen } from '../screens/auth';

const AuthStack = createNativeStackNavigator();

export const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator initialRouteName='Login'>
      <AuthStack.Screen
        options={{ headerShown: false }}
        name='Login'
        component={LoginScreen}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name='Register'
        component={RegisterScreen}
      />
    </AuthStack.Navigator>
  )     
}
