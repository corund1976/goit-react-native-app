import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { useSelector } from 'react-redux';
import { doc, updateDoc } from "firebase/firestore";

import { db } from '../firebase/config';

export function PostsList({ posts }) {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const navigation = useNavigation();
  const { userId } = useSelector(state => state.auth);

  const setLike = async (postId, likeUserIdsArray) => {
    const userExist = likeUserIdsArray.find(user => user === userId)

    if (!userExist) {
      const docRef = doc(db, 'posts', postId)
      await updateDoc(docRef, {
        likes: [...likeUserIdsArray, userId]
      });
    }
  }
  
  return (
    <FlatList
      data={posts}
      numColumns={ (windowWidth > windowHeight) ? 2 : 1}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.listItem}>

          {/* Фото */}
          <Image source={{ uri: item.photo }} style={styles.image} />
                      
          {/* Описание */}
          <Text style={styles.description}>{item.description}</Text>

          <View style={styles.buttonsContainer}>

            {/* Кнопка Комментарии */}
            <TouchableOpacity
              style={styles.commentsAndLikesBtn}
              onPress={() =>
                navigation.navigate('Comments', {
                  postId: item.postId,
                  postImage: item.photo,
                  postComments: item.comments
                })}
            >
              <Feather name='message-circle' size={24} style={{
                marginRight: 6,
                color: (item.comments<1) ? '#BDBDBD' : '#FF6C00'
              }} />
              <Text style={styles.numberComments}>{item.comments.length}</Text>
            </TouchableOpacity>

            {/* Кнопка Лайки */}
            <TouchableOpacity
              style={styles.commentsAndLikesBtn}
              onPress={() => setLike(item.postId, item.likes)}
            >
              <Feather name="thumbs-up" size={24} style={{
                  marginRight: 6,
                  color: (item.likes<1) ? '#BDBDBD' : '#FF6C00'
              }} />
              <Text style={styles.numberComments}>{item.likes.length}</Text>
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
  )
};

const styles = StyleSheet.create({
  listItem: {
    width: 375,

    marginHorizontal: 10,
    marginBottom: 32,
  },
  image: {
    borderRadius: 8,

    // width: '100%',
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

  commentsAndLikesBtn: {
    marginRight: 10,
    maxWidth: '20%',

    flexDirection: 'row',
  },
  numberComments: {
    fontSize: 16,
    lineHeight: 19,

    color: '#BDBDBD',
  },

  locationBtn: {
    maxWidth: '80%',

    flexDirection: 'row',
  },
  locationLink: {
    fontSize: 16,
    lineHeight: 19,
    textDecorationLine: 'underline',

    color: '#212121',
  }
});