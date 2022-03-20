import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';

import { Feather } from '@expo/vector-icons';

import { db } from '../../firebase/config';

export function PostsScreen ({ navigation }) {
  console.log('****** PostsScreen *******');

  const [posts, setPosts] = useState([])
  

  const getAllPosts = () => {
    db.collection('posts')
      .onSnapshot(data => {
        setPosts(data.docs.map(doc => ({ ...doc.data(), postId: doc.id })))
      })
  }
  
  const numComments = (id) => {
    let numComments = 0;
    db.collection(`posts/${id}/comments`)
        .onSnapshot(data => {
          numComments = Object.keys(data.docs).length;
          console.log(Object.keys(data.docs).length);
        })
    return numComments;
  }
  
  useEffect(() => {
    getAllPosts();
  }, []);

  const { userAvatar, userName, userEmail } = useSelector(state => state.auth);
   
  return (
    <View style={styles.container}>
      <View style={styles.user}>
        <Image
          source={{ uri: userAvatar }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userInfoName}>
            {userName}
          </Text>
          <Text style={styles.userInfoEmail}>
            {userEmail}
          </Text>
        </View>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>

            {/* Фото */}
            <Image source={{ uri: item.photo }} style={styles.image} />
                        
            {/* Описание */}
            <Text style={styles.description}>{item.description}</Text>

            {/* Кнопка Комментарии */}
            <View style={styles.buttonsContainer}>

              <TouchableOpacity
                style={styles.commentsBtn}
                onPress={() => navigation.navigate('Comments', { postId: item.postId, postImage: item.photo })}
              >
                <Feather name='message-circle' size={24} color={'#BDBDBD'} style={{ marginRight: 6 }} />
                <Text style={styles.numberComments}>{numComments(item.postId)}</Text>
              </TouchableOpacity>

              {/* Кнопка Геолокация */}
              <TouchableOpacity
                style={styles.locationBtn}
                onPress={() => navigation.navigate('Map', {
                  location:
                  {
                    locality: item.locality,
                    latitude: item.latitude,
                    longitude: item.longitude
                  }
                })}
              >
                <Feather name='map-pin' size={24} color={'#BDBDBD'} style={{ marginRight: 4 }} />
                {item.locality
                  ?
                    <Text style={styles.locationLink}>{item.locality}</Text>
                  :
                    <Text style={styles.locationLink}>{item.latitude.toFixed(4)}  {item.longitude.toFixed(4)}</Text>
                }
              </TouchableOpacity>

            </View>
          </View>
        )}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff'
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 32,
    marginBottom: 32,
  },
  avatar: {
    borderRadius: 16,

    width: 60,
    height: 60,

    marginRight: 8,
  },
  userInfoName: {
    fontWeight: 'bold',
    fontSize: 13,
    lineHeight: 15,

    color: '#212121',
  },
  userInfoEmail: {
    fontWeight: 'normal',
    fontSize: 11,
    lineHeight: 13,

    color: '#21212180'
  },
  listItem: {
    // alignItems: 'center',
    justifyContent: 'center',
    
    marginBottom: 32,
  },
  image: {
    borderRadius: 8,

    width: '100%',
    height: 240,

    marginBottom: 8,
  },
  description: {
    alignSelf: 'flex-start',

  },

  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "space-between"
  },

  commentsBtn: {
    marginRight: 10,
    maxWidth: '20%',

    flexDirection: 'row',
  },
  numberComments: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,

    color: '#BDBDBD',
  },

  locationBtn: {
    maxWidth: '80%',

    flexDirection: 'row',
  },
  locationLink: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    textDecorationLine: 'underline',

    color: '#212121',
  }

});

// import React from 'react';
// import { createStackNavigator } from '@react-navigation/stack';

// import DefaultScreenPosts from '../nestedScreens/DefaultScreenPosts';
// import CommentsScreen from '../nestedScreens/CommentsScreen';
// import MapScreen from '../nestedScreens/MapScreen';

// const NestedScreen = createStackNavigator();

// export const PostsScreen = () => {
//   return (
//     <NestedScreen.Navigator>
//       <NestedScreen.Screen component={DefaultScreenPosts} name='DefaultScreen' />
//       <NestedScreen.Screen component={CommentsScreen} name='Comments' />
//       <NestedScreen.Screen component={MapScreen} name='Map' />
//     </NestedScreen.Navigator>
//   );
// };
