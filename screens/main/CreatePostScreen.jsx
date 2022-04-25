import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image,
  ActivityIndicator
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { collection, addDoc } from "firebase/firestore";

import uploadImageToStorage from '../../helpers/uploadImage'
import { db } from '../../firebase/config';

const initialState = {
  photo: null,
  description: '',
  locality: '',
}

export const CreatePostScreen = ({ navigation }) => {
  console.log('********CreateScreen**********');
  const { userId, userName } = useSelector(state => state.auth);
  const isFocused = useIsFocused();

  const [cameraRef, setCameraRef] = useState(null);
  const [startCamera, setStartCamera] = useState(true);

  const [hasPermissionCamera, setHasPermissionCamera] = useState(null);
  const [hasPermissionLocation, setHasPermissionLocation] = useState(null);

  const [typeCamera, setTypeCamera] = useState(Camera.Constants.Type.back);
  const [availableRatios, setAvailableRatios] = useState([]);
  const [ratioCamera, setRatioCamera] = useState('4:3');
  const [availablePictureSizes, setAvailablePictureSizes] = useState([]);
  const [pictureSizeCamera, setPictureSizeCamera] = useState('640x480');

  const [state, setState] = useState(initialState);
 
  const [isLoading, setIsLoading] = useState(false);

  const [showKeyboard, setShowKeyboard] = useState(false);
   
  const getSupportedRatios = async () => {
    if (Platform.OS == 'android') {
      const supportedRatios = await cameraRef.getSupportedRatiosAsync();
      // console.log('#76 SupportedRatios', supportedRatios);
      setAvailableRatios(supportedRatios);
    }
  };

  const getAvailablePictureSizes = async () => {
    if (Platform.OS == 'android') {
      console.log('$83 Ratio', ratioCamera);

      const availablePictureSizes = await cameraRef.getAvailablePictureSizesAsync(ratioCamera);

      setAvailablePictureSizes(availablePictureSizes);

      // console.log('#86 availablePictureSizes', availablePictureSizes);

      setPictureSizeCamera(availablePictureSizes[0])

      // console.log('PictureSize=', availablePictureSizes[0]);
    }
  };

  useEffect(() => {  
    (async () => {
      console.log('createPost useEffect');

      let cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasPermissionCamera(cameraPermission.status === 'granted');
    
      let locationPermission = await Location.requestForegroundPermissionsAsync();
      setHasPermissionLocation(locationPermission.status === 'granted');

    })();
  }, []);

  useEffect(() => {
    getSupportedRatios();
    getAvailablePictureSizes();
  }, [ratioCamera]);

  if (hasPermissionCamera === null) {
    return <View />;
  }
  if (hasPermissionCamera === false) {
    return <Text>No access to camera</Text>;
  }
  
  if (hasPermissionLocation === null) {
    return <View />;
  }
  if (hasPermissionLocation === false) {
    return <Text>No access to location</Text>;
  }

  const takePhotoCamera = async () => {
    if (cameraRef) {
      const options = {
        // quality: 1,
        // base64: true,
        exif: true,
        skipProcessing: true,
      };
      const picture = await cameraRef.takePictureAsync(options);
      // console.log('exif', picture.exif);

      if (typeCamera === Camera.Constants.Type.front) {
        const manipResult = await manipulateAsync(
          picture.localUri || picture.uri,
          [
            { rotate: Platform.OS === 'ios' ? 270 : 180 },
            { flip: FlipType.Vertical },
          ],
          { compress: 0.6, format: SaveFormat.PNG }
        );
        setState(prevState => ({ ...prevState, photo: manipResult.uri }));
      };

      if (typeCamera === Camera.Constants.Type.back) {
        const manipResult = await manipulateAsync(
          picture.uri,
          [
            { rotate: Platform.OS === 'ios' ? 270 : 0 },
          ],
          { format: SaveFormat.PNG }
        );
        setState(prevState => ({ ...prevState, photo: manipResult.uri }));
      };

      setStartCamera(false);
    }
  }

  const takePhotoGallery = async () => {
    setStartCamera(false);
    // No permissions request is necessary for launching the image library
    let imageFromGallery = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!imageFromGallery.cancelled) {
      setState(prevState => ({ ...prevState, photo: imageFromGallery.uri }));
    } else {
      setStartCamera(true);
    }
  };

  const editPhoto = () => {
    setState(prevState => ({ ...prevState, photo: null }));
    setStartCamera(true);
  }

  const descriptionInputHandler = (text) => {
    setState((prevState) => ({ ...prevState, description: text }))
  }
  
  const localityInputHandler = (text) => {
    setState((prevState) => ({ ...prevState, locality: text, }))
  }

  const publishPhoto = async () => {
    await uploadPostToServer();

    if (!isLoading) {
      navigation.navigate('Posts');
      setState(initialState);
      setStartCamera(true);
    }
  }

  const uploadPostToServer = async () => {
    setIsLoading(true);

    const { photo, description, locality } = state;
    const photoURL = await uploadImageToStorage(photo, 'images/');

    console.log('!!!! start getting geolocation !!!!');

    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({});

    console.log('!!!! geolocation is ready !!!!');

    const newPost = {
      photo: photoURL,
      description,
      locality,
      latitude,
      longitude,
      userId,
      userName,
      comments: [],
      likes: []
    }

    console.log('!!!! created new Post');
    await addDoc(collection(db, "posts"), newPost);    
    
    setIsLoading(false);
    console.log('!!!! post uploaded to Firebase');
  };
  
  const deletePost = () => {
    setState(initialState);
    setStartCamera(true)
  }

  const hideKeyboard = () => {
    setShowKeyboard(false);
    Keyboard.dismiss();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={hideKeyboard}>
        <View style={{
          ...styles.inner,
          marginBottom: showKeyboard ? -200 : 0
        }}>
          {isLoading &&
            <ActivityIndicator size='large' style={styles.isloading} />
          }

          <View style={{ flex: 1 }}>
            
            <View style={{
              ...styles.pictureContainer, 
              borderColor: state.photo ? '#000000' : '#E8E8E8'
            }}>
              {/* Камера контейнер */}
              {startCamera && isFocused &&
                <Camera
                  ref={(camRef) => setCameraRef(camRef)}
                  style={styles.camera}
                  autoFocus='auto'
                  flashMode='auto'
                  type={typeCamera}
                  ratio={ratioCamera}
                  pictureSize={pictureSizeCamera}
                >
                </Camera>
              }

              {/* Кнопка смены фронт/тыл камеры */}
              <TouchableOpacity
                style={styles.flipBtn}
                onPress={() => {
                  setTypeCamera(
                    typeCamera === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              >
                <Ionicons name='camera-reverse' size={24} color={'black'} />
              </TouchableOpacity>

              {/* Кнопка смены пропорций фото */}
              <TouchableOpacity
                style={{
                  ...styles.ratioBtn,
                  display: Platform.OS === 'ios' ? 'none' : 'flex'
                }}
                onPress={() => {
                  setRatioCamera(ratioCamera === '4:3' ? '16:9' : '4:3')
                }}
              >
                <Text>{ratioCamera}</Text>
              </TouchableOpacity>

              {/* Индикатор разрешения фото */}
              <View style={{
                ...styles.sizeIndicator,
                display: Platform.OS === 'ios' ? 'none' : 'flex'
              }}>
                <Text>
                  {pictureSizeCamera}
                </Text>
              </View>

              {/* Кнопка сделать фото */}
              <TouchableOpacity
                onPress={takePhotoCamera}
                // style={{ ...styles.cameraBtnContainer, backgroundColor: state.photo ? 'rgba(255, 255, 255, 0.3)' : '#FFFFFF' }}
                style={{
                  ...styles.snapBtn,
                  backgroundColor: state.photo ? '#FFFFFF30' : '#FFFFFF'
                }}
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name='camera-alt'
                  size={24}
                  color={state.photo ? '#FFFFFF' : '#BDBDBD'}
                  style={styles.snapIcon}
                />
              </TouchableOpacity>

              {/* Превью контейнер */}
              {state.photo &&
                <Image source={{ uri: state.photo }} style={styles.preview} />
              }
            </View>

            {/* Блок под превью/камерой */}
            {!state.photo && (
              <TouchableOpacity
                onPress={takePhotoGallery}
                activeOpacity={0.8}
              >
                <Text style={styles.uploadEditButton}>
                  Загрузить фото из галереи
                </Text>
              </TouchableOpacity>
            )}

            {state.photo && (
              <TouchableOpacity
                onPress={editPhoto}
                activeOpacity={0.8}
              >
                <Text style={styles.uploadEditButton}>
                  Редактировать фото
                </Text>
              </TouchableOpacity>
            )}

            <TextInput
              placeholder='Название...'
              placeholderTextColor='#BDBDBD'
              value={state.description}
              onChangeText={descriptionInputHandler}
              onFocus={() => setShowKeyboard(true)}
              onBlur={() => setShowKeyboard(false)}
              style={styles.inputDescription}
            />

            <View>
              <Feather name='map-pin' size={24} color={'#BDBDBD'} style={styles.iconLocality} />
              <TextInput
                placeholder='Местность...'
                placeholderTextColor='#BDBDBD'
                value={state.locality}
                onChangeText={localityInputHandler}
                onFocus={() => setShowKeyboard(true)}
                onBlur={() => setShowKeyboard(false)}
                style={styles.inputLocality}
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
          </View>

          <TouchableOpacity
            onPress={deletePost}
            style={styles.deleteBtnContainer}
            activeOpacity={0.8}
          >
            <Feather name='trash-2' size={24} color='#BDBDBD' />          
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#ffffff',
  },
  isloading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
  },

  pictureContainer: {
    flex: 1,

    maxHeight: 240,
    width: 320,

    borderWidth: 1,
    borderRadius: 8,

    overflow: 'hidden',
    
    // marginTop: 32,
    marginHorizontal: 16,
    marginLeft: "auto",
    marginRight: 'auto',

    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    height: 240,
    width: 180,
    marginLeft: "auto",
    marginRight: 'auto',
    // flex: 1,
  },

  flipBtn: {
    position: 'absolute',
    top: 5,
    right: 10,
    borderRadius: 10,
    backgroundColor: 'lightgrey',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  ratioBtn: {
    position: 'absolute',
    bottom: 5,
    left: 10,
    borderRadius: 10,
    backgroundColor: 'lightgrey',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  sizeIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    borderRadius: 10,
    backgroundColor: 'lightgrey',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  snapBtn: {
    position: 'absolute',

    borderRadius: 50,
    
    width: 60,
    height: 60,

    justifyContent: 'center',
    alignItems: 'center',
  },
  snapIcon: {
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    shadowOpacity: 0.25,
    
    width: 24,
    height: 24
  },

  preview: {
    flex: 1,
    maxHeight: 240,
    width: 320,
  },

  uploadEditButton: {
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
  iconLocality: {
    position: 'absolute',
    top: 13,
    left: 16,
  },
  inputLocality: {
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
    // marginBottom: 120,

    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteBtnContainer: {
    borderRadius: 20,
    backgroundColor: '#F6F6F6',

    width: 70,
    height: 40,
    marginBottom: 25,

    alignSelf: 'center',

    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnIcon: {
    width: 24,
    height: 24,
  },
});
