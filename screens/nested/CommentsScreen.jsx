import React, {useState, useEffect} from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Text, View, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import { db } from "../../firebase/config";

export function CommentsScreen({ route }) {
  const { postId } = route.params;
  const { userName } = useSelector(state => state.auth);

  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState([]);

  useEffect(() => {
    getAllComments()
  }, []);

  const createComment = async () => {
    await db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .add({ comment, userName })
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
  }

  return (
    <View style={styles.container}>

      {/* Список комментариев */}
      <FlatList
        data={allComments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.userName}</Text>
            <Text>{item.comment}</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
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