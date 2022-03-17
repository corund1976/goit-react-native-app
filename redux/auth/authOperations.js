import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

import { authSlice } from './authReducer';
import { auth } from "../../firebase/config";

const { updateUserProfile, updateUserAvatar, changeAuthStatus, signOutUser } = authSlice.actions;

export const authSignUpUser = ({ avatar, name, email, password }) =>
  async (dispatch, getState) => {
    try {
      await auth.createUserWithEmailAndPassword(email, password);

      const user = await auth.currentUser;

      await user.updateProfile({
        photoURL: avatar,
        displayName: name,
      })

      const userUpdated = await auth.currentUser;

      const userUpdatedProfile = {
          id: userUpdated.uid,
          avatar: userUpdated.photoURL,
          name: userUpdated.displayName,
          email: userUpdated.email,
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
  }
    
export const authSignInUser = ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const user = await auth.signInWithEmailAndPassword(email, password);
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
  
export const changeAuthStatusUser = () =>
  async (dispatch, getState) => {
    await auth.onAuthStateChanged(user => {
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

export const changeAvatarUser = ( newAvatar ) =>
  async (dispatch, getState) => {
    const user = await auth.currentUser;

    await user.updateProfile({
      photoURL: newAvatar,
    })
    
    dispatch(updateUserAvatar({ avatar: user.photoURL }));
  };

export const authSignOutUser = () =>
  async (dispatch, getState) => {
    await auth.signOut();

    dispatch(signOutUser());
  };