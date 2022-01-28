import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';
import { Avatar } from 'native-base';
import appTheme from '../constants/theme';

const Comment = ({ navigation, comment, token }) => {
  return (
    <View style={style.shadowBox}>
      <View style={style.commentBox}>
        <View style={style.commentTop}>
          <TouchableOpacity style={style.commentUser} onPress={() => navigation.push("ProfileVisit", {token: token, pk: comment.user.pk })}>
            <Avatar size="sm" source={{ uri: comment.user.image }}></Avatar>
            <Text style={{ marginLeft: 5 }}>{comment.user.name}</Text>
          </TouchableOpacity>
          <View style={style.commentRating}>
            { comment.rating ? <Text style={{ backgroundColor: "rgb(234, 88, 12)", paddingHorizontal: 10, paddingVertical: 5, color: appTheme.COLORS.white, marginRight: 5, borderRadius: 10 }}>{comment.rating}</Text> : null}
            <Text style={{ color: "rgb(234, 88, 12)" }}>{comment.created}</Text>
          </View>
        </View>
        <Text style={{ color: appTheme.COLORS.gray }}>{comment.comment}</Text>
      </View>
    </View>
  );
};

Comment.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  comment: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

const Comments = ({ navigation, comments, token }) => {
  return (
    <View style={style.commentsContainer}>
      <Text style={style.commentsContainerTitle}>Comments</Text>
      <FlatList data={comments} renderItem={({ item }) => <Comment comment={item} navigation={navigation} token={token} />} />
    </View>
  );
};

Comments.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  comments: PropTypes.array.isRequired,
  token: PropTypes.string.isRequired,
};

export { Comments };

const style = StyleSheet.create({
  commentsContainer: {
    paddingHorizontal: 20,
  },
  commentsContainerTitle: {
    fontSize: 16,
    borderBottomWidth: 2,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentTop: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  commentUser: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  commentRating: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  commentBox: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: appTheme.COLORS.gray,
  },
});