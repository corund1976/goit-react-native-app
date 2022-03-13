import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, Alert } from 'react-native';

import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';

import { useSelector } from 'react-redux';

import { storage, firestore } from '../../firebase/config';

const initialState = {
  photo: null,
  description: '',
  locationName: '',
  // location: {
  //   latitude: null,
  //   longitude: null,
  // }
}

export const CreatePostScreen = ({ navigation }) => {
  console.log('********CreateScreen**********');

  const [state, setState] = useState(initialState);

  const [hasPermissionCamera, setHasPermissionCamera] = useState(null);
  const [hasPermissionLocation, setHasPermissionLocation] = useState(null);

  const [cameraRef, setCameraRef] = useState(null);
  const [typeCamera, setTypeCamera] = useState(Camera.Constants.Type.back);
  
  const { userId, userName } = useSelector(state => state.auth);

  useEffect(() => {
    (async () => {
      let cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasPermissionCamera(cameraPermission.status === 'granted');
    
      let locationPermission = await Location.requestForegroundPermissionsAsync();
      setHasPermissionLocation(locationPermission.status === 'granted');
    });
  }, []);

  // if (hasPermissionCamera === null) {
  //   return <View />;
  // }
  if (hasPermissionCamera === false) {
    return <Text>No access to camera</Text>;
  }
  
  // if (hasPermissionLocation === null) {
  //   return <View />;
  // }
  if (hasPermissionLocation === false) {
    return <Text>No access to location</Text>;
  }
         
  const takePhotoCamera = async () => {
    if (cameraRef) {
      const picture = await cameraRef.takePictureAsync();

      setState(prevState => ({ ...prevState, photo: picture.uri }));
    }
  }

  const takePhotoGallery = async () => {
    // No permissions request is necessary for launching the image library
    let imageFromGallery = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!imageFromGallery.cancelled) {
      setState(prevState => ({ ...prevState, photo: imageFromGallery.uri }));
    }
  };

  const editPhoto = () => {
    setState(prevState => ({ ...prevState, photo: null }));
  }

  const descriptionInputHandler = (text) => {
    setState((prevState) => ({ ...prevState, description: text }))
  }
  
  const locationInputHandler = (text) => {
    setState((prevState) => ({ ...prevState, locationName: text, }))
  }

  const publishPhoto = async () => {
    // console.log('При нажатии на Publish стейт имеет вид:', state);
    uploadPostToServer();
    // navigation.navigate('Posts', state);
    // setState(initialState);
  }

  const uploadPhotoToServer = async () => {
    const response = await fetch(state.photo);
    const file = await response.blob();
    const id = Date.now().toString();

    await storage
      .ref(`images/${id}`)
      .put(file);

    const processedPhotoURL = await storage
      .ref('images')
      .child(`${id}`)
      .getDownloadURL();
    
    console.log('-----------------processedPhoto-----------------------------', processedPhotoURL);

    return processedPhotoURL;
  }

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();
    const { description, locationName } = state;
    const { coords } = await Location.getCurrentPositionAsync({});
    // const location = {
    //   latitude: coords.latitude,
    //   longitude: coords.longitude,
    // };
    console.log('photo', photo);
    console.log('description', description);
    console.log('locationName', locationName);
    console.log('coords', coords);
    // console.log('location', location);
    console.log('userId', userId);
    console.log('userName', userName);

    const createPost = await firestore
      .collection('posts')
      .add({
        photo,
        description,
        locationName,
        location: coords,
        // locationLatitude: coords.latitude,
        // locationLongitude: coords.longitude,
        userId,
        userName
      });
    
    console.log('{*} ===> uploadPostToServer ===> createPost', createPost);
    return createPost;
  };
  
  const deletePhoto = () => {
    setState((prevState) => ({ ...prevState, photo: null }))
  }

  return (
    <View style={styles.container}>
      <View style={{ ...styles.cameraContainer, borderColor: state.photo ? '#000000' : '#E8E8E8' }}>
        <Camera
          style={styles.camera}
          type={typeCamera}
          autoFocus='on'
          ref={(ref) => setCameraRef(ref)}
        >
          {/* Просмотр полученной фото */}
          {state.photo && (
            <View style={styles.previewContainer}>
              <Image source={{ uri: state.photo }} style={styles.preview} />
            </View>
          )}
          
          {/* Кнопка смены фронт/тыл камеры */}
          {!state.photo && (
            <TouchableOpacity
              style={styles.flipContainer}
              onPress={() => {
                setTypeCamera(
                  typeCamera === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <Ionicons name='camera-reverse' size={24} color='black' />
            </TouchableOpacity>
          )}

          {/* Кнопка сделать фото */}
          {!state.photo && (
            <TouchableOpacity
              onPress={takePhotoCamera}
              // style={{ ...styles.cameraBtnContainer, backgroundColor: state.photo ? 'rgba(255, 255, 255, 0.3)' : '#FFFFFF' }}
              style={{ ...styles.cameraBtnContainer, backgroundColor: state.photo ? '#FFFFFF30' : '#FFFFFF' }}
              activeOpacity={0.8}
            >
              <MaterialIcons name='camera-alt' size={24} color={state.photo ? '#FFFFFF' : '#BDBDBD'} style={styles.cameraBtnIcon} />
            </TouchableOpacity>
          )}

        </Camera>
      </View>

      {!state.photo && (
        <TouchableOpacity
          onPress={takePhotoGallery}
          activeOpacity={0.8}
        >
          <Text style={styles.txtUnderCamera}>
            Загрузите фото
          </Text>
        </TouchableOpacity>
      )}

      {state.photo && (
        <TouchableOpacity
          onPress={editPhoto}
          activeOpacity={0.8}
        >
          <Text style={styles.txtUnderCamera}>
            Редактировать фото
          </Text>
        </TouchableOpacity>
      )}

      <TextInput
        placeholder='Название...'
        placeholderTextColor='#BDBDBD'
        value={state.description}
        onChangeText={descriptionInputHandler}
        style={styles.inputDescription}
      />

      <View>
        <Feather name='map-pin' size={24} color={'#BDBDBD'} style={styles.locationIcon} />
        <TextInput
          placeholder='Местность...'
          placeholderTextColor='#BDBDBD'
          value={state.locationName}
          onChangeText={locationInputHandler}
          style={styles.inputLocation}
        />
      </View>

      <TouchableOpacity
        onPress={publishPhoto}
        style={{ ...styles.publishBtnContainer, backgroundColor: state.photo ? '#FF6C00' : '#F6F6F6' }}
        activeOpacity={0.8}
      >
        <Text
          style={{ ...styles.publishBtnTxt, color: state.photo ? '#ffffff' : '#BDBDBD' }}
        >
          Опубликовать
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={deletePhoto}
        style={styles.deleteBtnContainer}
        activeOpacity={0.8}
      >
        <Feather name='trash-2' size={24} color='#BDBDBD' />          
      </TouchableOpacity>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#ffffff',
  },
  cameraContainer: {
    borderWidth: 1,
    borderRadius: 8,

    overflow: 'hidden',

    height: 240,
    marginTop: 32,
    marginHorizontal: 16,
  },
  camera: {
    flex: 1,
    // height: '70%',
    
    alignItems: 'center',
    justifyContent: 'center'
  },
  flipContainer: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
  cameraBtnContainer: {
    borderRadius: 50,
    
    width: 60,
    height: 60,

    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBtnIcon: {
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    shadowOpacity: 0.25,
    
    width: 24,
    height: 24
  },
  previewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  preview: {
    flex: 1,
  },
  txtUnderCamera: {
    fontSize: 16,
    lineHeight: 19,
    color: '#bdbdbd',
    
    marginTop: 8,
    marginBottom: 32,
    marginHorizontal: 16,
  },
  inputDescription: {
    color: '#212121',
    fontSize: 16,
    lineHeight: 19,
    borderColor: '#e8e8e8',
    borderBottomWidth: 1,
    
    height: 50,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  locationIcon: {
    position: 'absolute',
    top: 13,
    left: 16,
  },
  inputLocation: {
    color: '#212121',
    fontSize: 16,
    lineHeight: 19,
    borderColor: '#e8e8e8',
    borderBottomWidth: 1,
    
    paddingStart: 28,
    
    height: 50,
    marginBottom: 32,
    marginHorizontal: 16,
  },
  publishBtnTxt: {
    fontSize: 16,
    lineHeight: 19,
  },
  publishBtnContainer: {
    borderRadius: 100,

    paddingHorizontal: 32,
    paddingVertical: 16,

    // height: 51,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 120,

    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnContainer: {
    borderRadius: 20,
    backgroundColor: '#F6F6F6',

    width: 70,
    height: 40,
    alignSelf: 'center',

    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnIcon: {
    width: 24,
    height: 24,
  },
});

      // setState(prevState => ({
      //   ...prevState,
      //   photo: picture.uri,
      //   location: {
      //     latitude: location.coords.latitude,
      //     longitude: location.coords.longitude,
      //   }
      // }));
