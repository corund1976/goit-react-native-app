import React, { useState, useEffect } from 'react';
import { View, ImageBackground, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';

import { authSignOutUser, changeAvatarUser } from '../../redux/auth/authOperations';

export function ProfileScreen() {
  console.log('******ProfileScreen*******');
  const dispatch = useDispatch();
  const { userAvatar, userName } = useSelector(state => state.auth);

  const [avatar, setAvatar] = useState(userAvatar)

  useEffect(() => {
    if (avatar) {
      dispatch(changeAvatarUser(avatar));
    }
  }, [avatar]);

  const avatarAdd = async () => {
    // No permissions request is necessary for launching the image library
    const imageFromGallery = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!imageFromGallery.cancelled) {
      setAvatar(imageFromGallery.uri);
    }
  };
  
  const avatarDelete = () => {
    setAvatar(null);
  };

  const signOut = () => {
    dispatch(authSignOutUser());
  };

  return (
    <View style={styles.container}>

      <ImageBackground
      source={require('../../assets/images/PhotoBG.png')}
      style={styles.bgImage}
    >

        <View style={styles.profile}>
          
          {/* Аватарка */}
          <View style={styles.avatarContainer}>
            <Image style={styles.avatar} source={{ uri: avatar }} />
            {/* Кнопка Добавить/Удалить аватар */}
              <TouchableOpacity
                style={styles.avatarButton}
                activeOpacity={0.8}
                onPress={!avatar ? avatarAdd : avatarDelete}
              >
                <Ionicons name="add-circle-outline"
                  size={25}
                  color={'#FF6C00'}
                  style={avatar && styles.avatarRemoveIcon}
                />
              </TouchableOpacity>
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

        </View>

      </ImageBackground>

    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  bgImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
    
    
  },
  profile: {
    flex: 1,
    alignItems: 'center',

    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,

    marginTop: 143,
    paddingTop: 92,
    paddingHorizontal: 16,

    // position: 'relative'
  },
  avatarContainer: {
    paddingHorizontal: 12.5,
    position: 'absolute',
    top: -60,
  },
  avatar: {
    borderRadius: 16,
    backgroundColor: '#F6F6F6',

    width: 120,
    height: 120,

    // alignSelf: 'center',
  },
  avatarButton: {
    width: 25,
    height: 25,
    // alignItems: 'center',
    // justifyContent: 'center',
    
    position: 'absolute',
    bottom: 14,
    right: 0
  },
  avatarRemoveIcon: {
    // borderRadius: 50,
    // backgroundColor: '#FFFFFF',
    color: '#BDBDBD',

    transform: [{ rotate: '45deg' }],
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