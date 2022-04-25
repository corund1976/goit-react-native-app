import React, {useState, useEffect} from 'react';
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
  FlatList,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import { db } from '../../firebase/config';

export function CommentsScreen({ route }) {
  console.log('****** CommentsScreen *******');

  const { postId, postImage, postComments } = route.params;
  const { userAvatar, userEmail, userName } = useSelector(state => state.auth);

  const [newComment, setNewComment] = useState('');
  const [allComments, setAllComments] = useState(postComments);

  const [showKeyboard, setShowKeyboard] = useState(false);
  const [focusCommentInput, setFocusCommentInput] = useState(false);
  
  useEffect(() => {
    getAllComments()
    console.log('useEffect *getAllComments*  @CommentsScreen@ ');
  }, []);

  const createComment = async () => {
    if (newComment) {
      const docRef = doc(db, 'posts', postId)
      
      await updateDoc(docRef, {
        comments: [
          ...allComments,
          {
            comment: newComment,
            userAvatar,
            userEmail,
            userName,
            commentDate: Date.now(),
          }
        ]
      });
    };   
    
    setNewComment('');
    getAllComments();
  }

  const getAllComments = async () => {
    const docRef = doc(db, 'posts', postId)
    const docSnap = await getDoc(docRef);
    
    setAllComments(docSnap.data().comments);
  }

  const commentInputHandler = (text) => {
    setNewComment(text);
  };

  const onFocusCommentInput = () => {
    setShowKeyboard(true);
    setFocusCommentInput(true);
  }
  const onBlurCommentInput = () => {
    setShowKeyboard(false);
    setFocusCommentInput(false);
  }
  const hideKeyboard = () => {
    setShowKeyboard(false);
    Keyboard.dismiss();
  }

  const timestampToDate = (timestamp) => {
    const formattedDate = new Date(timestamp).toLocaleString('ru', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      // weekday: 'long',
      // timezone: 'UTC',
      hour: 'numeric',
      minute: 'numeric',
      // second: 'numeric'
    });

    return (formattedDate);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={hideKeyboard}>
        <View style={styles.inner}>
          {/* Пост фото */}
          <Image style={styles.postImage} source={{ uri: postImage }} />
          
          {/* Список комментариев */}
          <FlatList
            style={styles.list}
            data={allComments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              // Контейнер комментария
              <View style={{
                marginBottom: 24,
                flexDirection: item.userEmail !== userEmail ? 'row' : 'row-reverse'
              }}>
                {/* Аватарка комментария */}
                <Image
                  style={{
                    borderRadius: 50,
                    width: 28,
                    height: 28,
                    marginRight: item.userEmail !== userEmail ? 16 : 0,
                    marginLeft: item.userEmail !== userEmail ? 0 : 16,
                  }}
                  source={{ uri: item.userAvatar }}
                />
                {/* Текст комментария */}
                <View
                  style={{
                    borderTopLeftRadius: item.userEmail !== userEmail ? 0 : 6,
                    borderTopRightRadius: item.userEmail !== userEmail ? 6 : 0,
                    borderBottomLeftRadius: 6,
                    borderBottomRightRadius: 6,
                    backgroundColor: '#00000008',
                    padding: 16,
                  }}
                >
                  <Text>{item.comment}</Text>
                  <Text>{timestampToDate(item.commentDate)}</Text>
                </View>
                
              </View>
            )}  
          />

          {/* Форма ввода комментария */}
          <View style={{
            ...styles.form,
            marginBottom: showKeyboard ? 105 : 16,
          }}>

            {/* Comment */}
            <TextInput
              placeholder='Комментировать...'
              placeholderTextColor='#BDBDBD'
              value={newComment}
              onChangeText={commentInputHandler}
              onFocus={onFocusCommentInput}
              onBlur={onBlurCommentInput}
              style={styles.input}
            />

            {/* Кнопка Отправить комментарий */}
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.7}
              onPress={createComment}
            >
              <AntDesign name='arrowup' size={20} color='#ffffff' />
            </TouchableOpacity>

          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
  },  
  postImage: {
    flex: 1,
    borderRadius: 8,
    // width: 343,
    height: 240,
    marginHorizontal: 16,
    marginVertical: 32,
  },
  list: {
    flex: 1,

    marginHorizontal: 16,
  },
  form: {
    justifyContent: 'center',
    height: 80,
    marginHorizontal: 16,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#F6F6F6',
    borderColor: '#E8E8E8',
    borderRadius: 100,
    borderWidth: 1,
    paddingHorizontal: 16,
    minHeight: 50,
  },
  button: {
    position: 'absolute',
    right: 8,
    borderRadius: 50,
    backgroundColor: '#FF6C00',
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center'
  }
});