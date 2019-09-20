import React from 'react';
import { GetUserPosts } from '../../graphql/operation-result-types';
import { USER_POSTS } from '../../graphql/queries/user-queries';
import { GET_USER, GetUser } from '../../apollo/resolvers';
import PostCardList from '../../apollo-wrapped-components/PostCardList';
import { RouteComponentProps } from '@reach/router';
import { useQuery } from '@apollo/react-hooks';

interface Props extends RouteComponentProps { };

export default function (props: Props) {
  const { data } = useQuery<GetUserPosts>(USER_POSTS);
  const { data: user_data } = useQuery<GetUser>(GET_USER);
  const user = user_data && user_data.getUser ? user_data.getUser : null;

  const posts = data && data.user && data.user.posts ? data.user.posts : null;

  return (
    <div>
      <h1>Profile</h1>
      {
        user && posts && (
          <PostCardList posts={posts} is_owner={false} user={user} />
        )
      }
    </div>
  );
};

