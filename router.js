import React from 'react';

import { AuthStackNavigator } from './navigators/authStackNavigator';
import { MainTabNavigator } from './navigators/mainTabNavigator';

export default function useRoute(isAuthorised) {
  return (
    !isAuthorised
      ?
      (<AuthStackNavigator />)
      :
      (<MainTabNavigator />)
  )
};