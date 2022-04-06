import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ImageBackground,
} from 'react-native';
import { useDispatch } from "react-redux";

import { authSignInUser } from "../../redux/auth/authOperations";

const initialState = {
  email: '',
  password: '',
}

export function LoginScreen({ navigation }) {
  const dispatch = useDispatch()

  const [state, setState] = useState(initialState)

  const [showKeyboard, setShowKeyboard] = useState(false);
  const [focusEmailInput, setFocusEmailInput] = useState(false);
  const [focusPasswordInput, setFocusPasswordInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailInputHandler = (text) => {
    setState((prevState) => ({ ...prevState, email: text }))
  };
  const passwordInputHandler = (text) => {
    setState((prevState) => ({ ...prevState, password: text }))
  };

  const hideKeyboard = () => {
    setShowKeyboard(false);
    Keyboard.dismiss();
  }

  const handleSubmit = () => {
    setShowKeyboard(false);
    Keyboard.dismiss();
    dispatch(authSignInUser(state));
    setState(initialState);
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

  const showHidePass = () => {
    setShowPassword(!showPassword);
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

            <Text style={styles.formTitle}>
              Войти
            </Text>

            <TextInput
              placeholder="Адрес электронной почты"
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

            <View style={styles.inputWrapper}>
              {/* Password */}
              <TextInput
                placeholder="Пароль"
                placeholderTextColor='#BDBDBD'
                secureTextEntry={!showPassword ? true : false}
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

              {/* Кнопка Show/Hide password */}
              <TouchableOpacity
                style={styles.btnShowpass}
                activeOpacity={0.8}
                onPress={showHidePass}
              >
                <Text style={styles.btnShowpassTitle}>
                  показать
                </Text>
              </TouchableOpacity>
            </View>


            <TouchableOpacity
              style={styles.btnLog}
              activeOpacity={0.8}
              onPress={handleSubmit}
            >
              <Text style={styles.btnLogTitle}>
                Войти
              </Text>
            </TouchableOpacity>


            <TouchableOpacity
              style={{ marginBottom: showKeyboard ? -97 : 144 }} /* 207-78=129-32=97 */
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.link}>
                Нет аккаунта? Зарегистрироваться
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

    paddingTop: 32,
    paddingHorizontal: 16,
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

  inputWrapper: {
    position: "relative",
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

  btnShowpass: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  btnShowpassTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'right',

    color: '#1B4371',
  },

  btnLog: {
    backgroundColor: '#FF6C00',
    borderRadius: 100,

    padding: 16,

    width: 343,
    height: 51,

    marginTop: 27,
    marginBottom: 16,

    alignItems: 'center'
  },
  btnLogTitle: {
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