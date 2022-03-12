import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import useRoute from '../router';
import { changeAuthStatusUser } from '../redux/auth/authOperations';

function Main() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(changeAuthStatusUser());
  }, []);
  
  const isAuthorised = useSelector(state => state.auth.authStatus); 
  const router = useRoute(isAuthorised);

  return (
    <NavigationContainer>
      {router}
    </NavigationContainer>
  )
};

export default Main;