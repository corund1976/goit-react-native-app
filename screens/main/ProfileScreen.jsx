import React, { useState, useEffect } from 'react';
import { View, ImageBackground, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { db } from '../../firebase/config';
import { authSignOutUser } from '../../redux/auth/authOperations';
import { PostsList } from '../../components';
import { AvatarContainer } from '../../components';

const BG = '../../assets/images/PhotoBG.png';

export function ProfileScreen() {
  console.log('****** ProfileScreen *******');

  const dispatch = useDispatch();
  const { userName, userId } = useSelector(state => state.auth);

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    getAllUserPosts();
    console.log('useEffect "getAllUserPosts"  @ProfileScreen@ ');
  }, [])
  
  const getAllUserPosts = async () => {
    const q = query(collection(db, "posts"), where("userId", "==", userId));
    
    onSnapshot(q, (querySnapshot) =>
        setUserPosts(querySnapshot.docs.map(doc => ({ ...doc.data(), postId: doc.id, })))
      )
  }

  const signOut = () => {
    dispatch(authSignOutUser());
  };

  return (
    <View style={styles.container}>

      <ImageBackground
        source={require(BG)}
        style={styles.bgImage}
      >

        <View style={styles.profile}>

          <View style={styles.avatar}> 
            <AvatarContainer />
          </View>
                    
          {/* Кнопка Логаут */}
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.8}
            onPress={signOut}
          >
            <MaterialIcons name="logout" size={24} color={'#BDBDBD'} />
          </TouchableOpacity>

          {/* Профиль имя */}
          <Text style={styles.profileTitle}>
            {userName}
          </Text>

          <PostsList posts={userPosts} />

        </View>
      </ImageBackground>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'flex-end'
  },
  bgImage: {
    flex: 1,
    resizeMode: 'cover',
    // justifyContent: 'flex-end',
  },
  profile: {
    flex: 1,
    // alignItems: 'center',
    // выставляем карточки по центру в столбце

    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,

    marginTop: 143,
    paddingTop: 92,
    paddingHorizontal: 16,

    position: 'relative'
  },
  avatar: {
    position: 'absolute',
    top: -60,
    left: 128,
  },
  logoutButton: {
    position: 'absolute',
    top: 22,
    right: 16
  },
  profileTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 30,
    lineHeight: 35,
    textAlign: 'center',
    letterSpacing: 0.01,
    color: '#212121',

    marginBottom: 32,
  },

});