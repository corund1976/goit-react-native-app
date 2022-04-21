import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { collection, onSnapshot, query } from 'firebase/firestore';

import { db } from '../../firebase/config';
import { PostsList } from '../../components';

const defaultAvatar = '../../assets/images/default-avatar.png';

export function PostsScreen () {
  console.log('****** PostsScreen *******');

  const [posts, setPosts] = useState([])
  
  const getAllPosts = async () => {
    const q = query(collection(db, 'posts'));
    
    onSnapshot(q, (querySnapshot) => {
      setPosts(querySnapshot.docs.map(doc => ({ ...doc.data(), postId: doc.id, })))
    })
  }
      
  useEffect(() => {
    getAllPosts();
    console.log('useEffect *getAllPosts*  @PostsScreen@');
  }, []);

  const { userAvatar, userName, userEmail } = useSelector(state => state.auth);
   
  return (
    <View style={styles.container}>

      {/* Контейнер профиль пользователя */}
      <View style={styles.user}>

        {/* Аватар */}
        <Image
          source={userAvatar ? { uri: userAvatar } : require(defaultAvatar) }
          style={styles.avatar}
        />
        
        <View style={styles.userInfo}>

          {/* Имя */}
          <Text style={styles.userInfoName}>
            {userName}
          </Text>

          {/* Email */}
          <Text style={styles.userInfoEmail}>
            {userEmail}
          </Text>
        </View>
      </View>

      <PostsList posts={posts} />

    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff'
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 32,
    marginBottom: 32,
    marginRight: 'auto'
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
});
