import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';

import { PostsScreen, CommentsScreen, MapScreen } from '../nested';

import { useDispatch } from 'react-redux';
import { authSignOutUser } from '../../redux/auth/authOperations';

const NestedStack = createNativeStackNavigator();

export function HomeScreen() {
  console.log("******** HomeScreen **********");
  const dispatch = useDispatch();

  const signOut = () => {
    dispatch(authSignOutUser());
  };
  
  return (
    <NestedStack.Navigator
      initialRouteName={PostsScreen}
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
      }}
    >
      <NestedStack.Screen
        name='Posts'
        component={PostsScreen}
        options={{
          title: 'Публикации',
          headerRight: () => (
            <TouchableOpacity
              style={{ width: 24, marginRight: 16 }}
              onPress={signOut}
            >
              <MaterialIcons name="logout" size={24} color={'#BDBDBD'} />
            </TouchableOpacity>
          ),
        }}
      />      
      <NestedStack.Screen
        name='Comments'
        component={CommentsScreen}
        options={{
          title: 'Комментарии',
        }}
      />
      <NestedStack.Screen
        name='Map'
        component={MapScreen}
        options={{
          title: 'Карта',
        }}
      />
    </NestedStack.Navigator>
  )
}