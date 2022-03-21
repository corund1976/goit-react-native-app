import React, { useState, useEffect } from 'react';
import { View, ImageBackground, TouchableOpacity, Text, StyleSheet, Image, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';

import { db } from '../../firebase/config';
import { authSignOutUser, changeAvatarUser } from '../../redux/auth/authOperations';

const defaultAvatar = '../../assets/images/default-avatar.png';
const BG = '../../assets/images/PhotoBG.png';

export function ProfileScreen({ navigation }) {
  console.log('******ProfileScreen*******');
  const dispatch = useDispatch();
  const { userAvatar, userName, userId } = useSelector(state => state.auth);

  const [avatar, setAvatar] = useState(userAvatar);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    getAllUserPosts();
  }, [])
  
  useEffect(() => {
    if (avatar) {
      dispatch(changeAvatarUser(avatar));
    }
  }, [avatar]);

  const getAllUserPosts = async () => {
    db.collection("posts").where("userId", "==", userId)
      .onSnapshot(data =>
        setUserPosts(data.docs.map(doc => ({ ...doc.data(), postId: doc.id, })))
      )
  }

  const like = async (postId, likes) => {
    console.log('#39', userPosts);
    const userExist = likes.find(item => {
      item == userId
      // console.log('item', item);
      // console.log('userId', userId);
    })
    if (userExist) {
      await db
        .collection("posts")
        .doc(postId)
        .update({
          likes: [...likes, userId]
        });
    }
    // console.log();
  }
  
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
        source={require(BG)}
        style={styles.bgImage}
      >

        <View style={styles.profile}>
          
          {/* Аватарка */}
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={avatar ? { uri: avatar } : require(defaultAvatar) }
            />

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

          <FlatList
            data={userPosts}
            // numColumns={2}
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
                    style={styles.commentsBtn}
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
                    onPress={() => like(item.postId, item.likes)}
                  >
                    <Feather name="thumbs-up" size={24} style={{
                        marginRight: 6,
                        color: (item.comments<1) ? '#BDBDBD' : '#FF6C00'
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
    // alignItems: 'center',

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
    left: '42.5%',
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