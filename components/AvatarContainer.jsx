import React, { useState} from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons} from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';

import { changeAvatarUser } from '../redux/auth/authOperations';
import { storage } from '../firebase/config';

const defaultAvatar = '../assets/images/default-avatar.png';

export function AvatarContainer() {
  const dispatch = useDispatch()
  const { userAvatar } = useSelector(state => state.auth);
  
  const [avatar, setAvatar] = useState(userAvatar);
  
  const uploadAvatarToStorage = async (avatar) => {
    console.log('!!!! start uploading Avatar to Storage !!!!');
    
    const response = await fetch(avatar);
    const file = await response.blob();
    const id = Date.now().toString();
    
    await storage.ref(`avatars/${id}`).put(file);
      
    const processedAvatarURL = await storage.ref('avatars').child(`${id}`).getDownloadURL();
    console.log('!!!! Avatar uploaded to Storage successfully !!!!');
    return processedAvatarURL;
  }

  const avatarAddHandler = async () => {
    // No permissions request is necessary for launching the image library
    const imageFromGallery = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!imageFromGallery.cancelled) {
      setAvatar(imageFromGallery.uri);
      const processedAvatarURL = await uploadAvatarToStorage(imageFromGallery.uri)
      dispatch(changeAvatarUser(processedAvatarURL));    
    }
  };
  
  const avatarDeleteHandler = () => {
    setAvatar(null);
    dispatch(changeAvatarUser(null));
  };

  return (
    <View style={styles.avatarContainer}>
      <Image
        style={styles.avatar}
        source={avatar ? { uri: avatar } : require(defaultAvatar) }
      />

      {/* Кнопка Добавить/Удалить аватар */}
        <TouchableOpacity
          style={styles.avatarButton}
          activeOpacity={0.8}
          onPress={!avatar ? avatarAddHandler : avatarDeleteHandler}
        >
          <Ionicons name="add-circle-outline"
            size={25}
            color={'#FF6C00'}
            style={avatar && styles.avatarRemoveIcon}
          />
        </TouchableOpacity>
    </View>
  )
};

const styles = StyleSheet.create({
  avatarContainer: {
    paddingHorizontal: 12.5,
  },
  avatar: {
    borderRadius: 16,
    backgroundColor: '#F6F6F6',

    width: 120,
    height: 120,
  },
  avatarButton: {
    width: 25,
    height: 25,
    
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
});