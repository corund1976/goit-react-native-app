import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';

import { HomeScreen, CreatePostScreen, ProfileScreen } from '../screens/main';
import GoBackButton from '../components/GoBackButton';

const MainTab = createBottomTabNavigator();

export const MainTabNavigator = () => {
  return (
    <MainTab.Navigator
      initialRouteName={HomeScreen}
      screenOptions={{      
        // headerShown: false,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'Roboto-Regular',
          fontWeight: '500',
          fontSize: 17,
          lineHeight: 22,
          letterSpacing: -0.4,
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingHorizontal: 58,
          paddingTop: 9,
          paddingBottom: 22,
          height: 71,
        },
        tabBarItemStyle: {
          borderRadius: 20,
          height: 40,
          marginHorizontal: 8,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarActiveBackgroundColor: '#FF6C00',
      }}
    >
      <MainTab.Screen
        name='Home'
        component={HomeScreen}
        options={({ route }) => {
          console.log(route.name);
          // console.log(getFocusedRouteNameFromRoute(route));
          return {
            headerShown: false,
            tabBarStyle: {
              display:
              // getFocusedRouteNameFromRoute(route) === 'Home' ? 'flex' : 'none',
                route.name === 'Home' ? 'flex' : 'none',
            },
            tabBarIcon: ({ focused, size, color }) => (
              <Ionicons name="grid-outline" size={24} color={color} />
            ),
          }
        }}       
      />
      <MainTab.Screen
        name='Create'
        component={CreatePostScreen}
        options={{
          title: 'Создать публикацию',
          headerLeft: () => (
            <GoBackButton />
          ),
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons name="add-outline" size={24} color={color} />
          ),
        }}
      />
      <MainTab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </MainTab.Navigator>
  )

}