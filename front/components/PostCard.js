import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Button, Card, Popover, List, Comment, Avatar } from "antd";
import {
  EllipsisOutlined,
  HeartOutlined,
  HeartTwoTone,
  MessageOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { REMOVE_POST_REQUEST } from "../reducers/post";

import PostImages from "./PostImages";
import CommentForm from "./CommentForm";
import PostCardContent from "./PostCardContent";
import FollowButton from "./FollowButton";

const PostCard = ({ post }) => {
  let dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const [commentFormOpend, setCommentFormOpend] = useState(false);
  const id = useSelector((state) => state.user.me?.id);
  const { removePostLoading } = useSelector((state) => state.post);
  // ?.optional chaning me가 있으면 id가 들어가고 없으면 undefined가 들어간다.
  //const id = me?.id;

  const onToggleLike = useCallback(() => {
    setLiked((prev) => !prev);
  }, []);
  const onToggleComment = useCallback(() => {
    setCommentFormOpend((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, []);

  return (
    <div style={{ marginBottom: 20 }}>
      {/* 배열안에 jsx를 넣으려면 항상 key를 넣어야 한다. */}
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" />,
          liked ? (
            <HeartTwoTone twoToneColor="#eb2f9" key="heart" onClick={onToggleLike} />
          ) : (
            <HeartOutlined key="heart" onClick={onToggleLike} />
          ),
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="more"
            content={
              <Button.Group>
                {id && post.User.id === id ? (
                  <>
                    <Button>수정</Button>
                    <Button type="danger" loading={removePostLoading} onClick={onRemovePost}>
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        extra={id && <FollowButton post={post} />}
      >
        <Card.Meta
          avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
          title={post.User.nickname}
          description={<PostCardContent postData={post.content} />}
        />
      </Card>
      {commentFormOpend && (
        <div>
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                  content={item.content}
                ></Comment>
              </li>
            )}
          />
        </div>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createAt: PropTypes.object,
    Images: PropTypes.arrayOf(PropTypes.object),
    Comments: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default PostCard;
