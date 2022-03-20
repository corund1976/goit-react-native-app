import React, {useState, useEffect} from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View, FlatList, Image, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import { db } from "../../firebase/config";

export function CommentsScreen({ route }) {
  const { postId, postImage } = route.params;
  const { userName, userAvatar } = useSelector(state => state.auth);


  console.log('postId', postId);
  console.log("postImage", postImage);
  console.log("userName", userName);
  console.log("userAvatar", userAvatar);

  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState([]);

  const [showKeyboard, setShowKeyboard] = useState(false);

  useEffect(() => {
    getAllComments()
  }, []);

  const createComment = async () => {
    await db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .add({ comment, userName, userAvatar })
    
    setComment('')
  }

  const getAllComments = async () => {
    await db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .onSnapshot(data =>
        setAllComments(data.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
  }

  const commentInputHandler = (text) => {
    setComment(text);
  };

  const hideKeyboard = () => {
    setShowKeyboard(false);
    Keyboard.dismiss();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={hideKeyboard}>

        <View>
          {/* Пост фото */}
          <Image style={styles.postImage} source={{ uri: postImage }} />
          
          {/* Список комментариев */}
          <FlatList
            style={styles.list}
            data={allComments}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={{
                marginBottom: 24,
                flexDirection: item.userName !== userName ? "row" : "row-reverse"
              }}>
                <Image
                  style={{
                    borderRadius: 50,
                    width: 28,
                    height: 28,
                    marginRight: item.userName !== userName ? 16 : 0,
                    marginLeft: item.userName !== userName ? 0 : 16,
                  }}
                  source={{ uri: item.userAvatar }}
                />
                <Text
                  style={{
                    borderTopLeftRadius: item.userName !== userName ? 0 : 6,
                    borderTopRightRadius: item.userName !== userName ? 6 : 0,
                    borderBottomLeftRadius: 6,
                    borderBottomRightRadius: 6,
                    backgroundColor: "#00000008",
                    padding: 16,
                  }}
                >
                  {item.comment}
                </Text>
              </View>
            )}  
          />

          {/* Форма ввода комментария */}
          <View style={styles.form}>

            {/* Поле Комментарий */}
            <TextInput
              placeholder='Комментировать...'
              placeholderTextColor='#BDBDBD'
              value={comment}
              onChangeText={commentInputHandler}
              style={styles.input}
            />

            {/* Кнопка Отправить комментарий */}
            <TouchableOpacity
              style={styles.button}
              onPress={createComment}
            >
              <AntDesign name="arrowup" size={20} color="#ffffff" />
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
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  postImage: {
    borderRadius: 8,

    // width: 343,
    height: 240,

    marginHorizontal: 16,
    marginTop: 32,
    marginBottom: 32,
    
  },
  list: {
    marginHorizontal: 16,
    marginBottom: 31,
  },
  // commentContainer: {
  //   flexDirection: 'row',
  //   marginBottom: 24,
  // },
  // avatar: {
  //   borderRadius: 50,

  //   width: 28,
  //   height: 28,

  //   marginRight: 16,
  // },
  // comment: {
  //   borderTopLeftRadius: 0,
  //   borderTopRightRadius: 6,

  //   borderBottomLeftRadius: 6,
  //   borderBottomRightRadius: 6,
    
  //   backgroundColor: "#00000008",

  //   padding: 16,
  // },
  form: {
    position: "relative",
    minHeight: 50,
    marginHorizontal: 16,
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#F6F6F6",
    borderColor: '#E8E8E8',
    borderRadius: 100,
    borderWidth: 1,
    paddingHorizontal: 16,
    flex: 1,
  },
  button: {
    position: 'absolute',
    right: 8,
    borderRadius: 50,
    backgroundColor: "#FF6C00",
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center"
  }
});