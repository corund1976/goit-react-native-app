import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { AuthStackNavigator } from './authStackNavigator';
import { MainTabNavigator } from './mainTabNavigator';
import { changeAuthStatusUser } from '../redux/auth/authOperations';

export function Router() {
  const dispatch = useDispatch();
  const isAuthorised = useSelector(state => state.auth.authStatus); 
  
  useEffect(() => {
    dispatch(changeAuthStatusUser());
  }, []);
  
  return (
    <NavigationContainer>
      {!isAuthorised
        ?
        <AuthStackNavigator />
        :
        <MainTabNavigator />
      }
    </NavigationContainer>
  )
};