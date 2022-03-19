import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard, Image, ImageBackground } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import { authSignUpUser } from '../../redux/auth/authOperations';

const defaultAvatar = '../../assets/images/default-avatar.png';

const initialState = {
  avatar: null,
  name: '',
  email: '',
  password: '',
}

export function RegisterScreen({ navigation }) {
  console.log('******RegisterScreen*******');
  const dispatch = useDispatch()

  const [state, setState] = useState(initialState)

  const [showKeyboard, setShowKeyboard] = useState(false);
  
  const [focusNameInput, setFocusNameInput] = useState(false);
  const [focusEmailInput, setFocusEmailInput] = useState(false);
  const [focusPasswordInput, setFocusPasswordInput] = useState(false);

  const avatarAdd = async () => {
    // No permissions request is necessary for launching the image library
    let avatarFromGallery = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!avatarFromGallery.cancelled) {
      setState(prevState => ({ ...prevState, avatar: avatarFromGallery.uri }));
    }
  };
    
  const avatarDelete = () => {
    setState(prevState => ({ ...prevState, avatar: null }))
  };

  const nameInputHandler = (text) => {
    setState(prevState => ({ ...prevState, name: text }))
  };
  const emailInputHandler = (text) => {
    setState(prevState => ({ ...prevState, email: text }))
  };
  const passwordInputHandler = (text) => {
    setState(prevState => ({ ...prevState, password: text }))
  };

  const hideKeyboard = () => {
    setShowKeyboard(false);
    Keyboard.dismiss();
  }

  const handleSubmit = async () => {
    hideKeyboard();
    dispatch(authSignUpUser(state));
    setState(initialState);     
  }
  
  const onFocusNameInput = () => {
    setShowKeyboard(true);
    setFocusNameInput(true);
  }
  const onBlurNameInput = () => {
    setShowKeyboard(false);
    setFocusNameInput(false);
  }

  const onFocusEmailInput = () => {
    setShowKeyboard(true);
    setFocusEmailInput(true);
  }
  const onBlurEmailInput = () => {
    setShowKeyboard(false);
    setFocusEmailInput(false);
  }

  const onFocusPasswordInput = () => {
    setShowKeyboard(true);
    setFocusPasswordInput(true);
  }
  const onBlurPasswordInput = () => {
    setShowKeyboard(false);
    setFocusPasswordInput(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={hideKeyboard}>
        <ImageBackground
          source={require('../../assets/images/PhotoBG.png')}
          style={styles.bgImage}
        >

          <View style={styles.form}>
              
            {/* Аватарка */}
            <View style={styles.avatarContainer}>
              <Image
                style={styles.avatar}
                source={state.avatar ? { uri: state.avatar } : require(defaultAvatar) }
              />

              {/* Кнопка Добавить/Удалить аватар */}
                <TouchableOpacity
                  style={styles.avatarButton}
                  activeOpacity={0.8}
                  onPress={!state.avatar ? avatarAdd : avatarDelete}
                >
                  <Ionicons name="add-circle-outline"
                    size={25}
                    color={'#FF6C00'}
                    style={state.avatar && styles.avatarRemoveIcon}
                  />
                </TouchableOpacity>

            </View>

            {/* Название формы */}
            <Text style={styles.formTitle}>
              Регистрация
            </Text>

            {/* Name */}
            <TextInput
              placeholder='Имя'
              placeholderTextColor='#BDBDBD'
              value={state.name}
              onChangeText={nameInputHandler}
              onFocus={onFocusNameInput}
              onBlur={onBlurNameInput}
              style={{
                ...styles.input,
                borderColor: focusNameInput ? '#FF6C00' : '#E8E8E8',
                backgroundColor: focusNameInput ? '#FFFFFF' : '#F6F6F6',
              }}
            />

            {/* Email */}
            <TextInput
              placeholder='Адрес электронной почты'
              placeholderTextColor='#BDBDBD'
              value={state.email}
              onChangeText={emailInputHandler}
              onFocus={onFocusEmailInput}
              onBlur={onBlurEmailInput}
              style={{
                ...styles.input,
                borderColor: focusEmailInput ? '#FF6C00' : '#E8E8E8',
                backgroundColor: focusEmailInput ? '#FFFFFF' : '#F6F6F6',
              }}
            />

            {/* Password */}
            <TextInput
              placeholder='Пароль'
              placeholderTextColor='#BDBDBD'
              secureTextEntry={true}
              value={state.password}
              onChangeText={passwordInputHandler}
              onFocus={onFocusPasswordInput}
              onBlur={onBlurPasswordInput}
              style={{
                ...styles.input,
                borderColor: focusPasswordInput ? '#FF6C00' : '#E8E8E8',
                backgroundColor: focusPasswordInput ? '#FFFFFF' : '#F6F6F6',
              }}
            />

            {/* Кнопка Register */}
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonTitle}>
                Зарегистрироваться
              </Text>
            </TouchableOpacity>

            {/* Cсылка на  страницу Login */}
            <TouchableOpacity
              style={{ marginBottom: showKeyboard ? -97 : 78 }} /* 207-78=129-32=97 */
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Login')}
            > 
              <Text style={styles.link}>
                Уже есть аккаунт? Войти
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

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
  form: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,

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
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    color: '#BDBDBD',

    transform: [{ rotate: '45deg' }],
  },
  formTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 30,
    lineHeight: 35,
    textAlign: 'center',
    letterSpacing: 0.01,
    color: '#212121',

    marginBottom: 32,
  },
  input: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
    color: '#212121',

    borderWidth: 1,
    borderRadius: 8,

    paddingHorizontal: 16,

    width: 343,
    height: 50,

    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FF6C00',
    borderRadius: 100,

    paddingHorizontal: 16,

    width: 343,
    height: 51,

    marginTop: 27,
    marginBottom: 16,

    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
    color: '#ffffff',
  },
  link: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
    // textAlign: 'center',
    color: '#1B4371',
  }
})