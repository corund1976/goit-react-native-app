import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile, signOut } from 'firebase/auth';

import { auth } from '../../firebase/config';
import { authSlice } from './authReducer';

const { updateUserProfile, updateUserAvatar, changeAuthStatus, signOutUser } = authSlice.actions;

export const authSignUpUser = ({ name, email, password }) => async (dispatch, getState) => {
  try {
    // Берем из стейта Редакса Аватарку для дальнейшей Регистрации
    const userAvatar = getState().auth.userAvatar;
    // Потому что на этом шаге стейт затирается
    await createUserWithEmailAndPassword(auth, email, password);

    const user = auth.currentUser;

    await updateProfile(user, {
      photoURL: userAvatar,
      displayName: name,
    })

    const userUpdated = auth.currentUser;

    const userUpdatedProfile = {
      id: userUpdated.uid,
      name: userUpdated.displayName,
      email: userUpdated.email,
      avatar: userUpdated.photoURL
    };

    dispatch(updateUserProfile(userUpdatedProfile));
  } catch (error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;

    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak');
    }
    if (errorCode == 'auth/email-already-in-use') {
      alert('Already exists an account with the given email address');
    }
    if (errorCode == 'auth/invalid-email') {
      alert('Email address is not valid');
    }
    else {
      alert(errorMessage);
    }
    console.log(error);
  };
};

export const authSignInUser = ({ email, password }) => async (dispatch, getState) => {
  try {
    const user = await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    if (errorCode === 'auth/wrong-password') {
      alert('Password is invalid for the given email, or the account corresponding to the email does not have a password set');
    }
    if (errorCode === 'auth/user-not-found') {
      alert('No user corresponding to the given email');
    }
    if (errorCode === 'auth/user-disabled') {
      alert('User corresponding to the given email has been disabled');
    }
    if (errorCode === 'auth/invalid-email') {
      alert('Email address is not valid');
    } else {
      alert(errorMessage);
    }
    console.log(error);
  };
};

export const changeAuthStatusUser = () => async (dispatch, getState) => {
  await onAuthStateChanged(auth, user => {
    if (user) {
      const userUpdatedProfile = {
        id: user.uid,
        avatar: user.photoURL,
        name: user.displayName,
        email: user.email,
      }

      dispatch(updateUserProfile(userUpdatedProfile));
      dispatch(changeAuthStatus({ authStatus: true }));
    }
  });
};

export const changeAvatarUser = (processedAvatarURL) => async (dispatch, getState) => {
  const user = auth.currentUser;
  // Проверка: это 'Регистрация' или 'Профиль'. Если 'Регистрация', то user еще не существует...
  if (user !== null) {
    await updateProfile(user, {
      photoURL: processedAvatarURL,
    })
  }
  // Запись в стейт Редакса Аватарки, чтобы при Регистрации 'authSignUpUser' взяла оттуда данные
  dispatch(updateUserAvatar({ avatar: processedAvatarURL }));
};

export const authSignOutUser = () => async (dispatch, getState) => {
  await signOut(auth);

  dispatch(signOutUser());
};
