import React from 'react';
import { GetPosts } from '../../graphql/operation-result-types';
import { POSTS } from '../../graphql/queries/post-queries';
import { GET_USER, GetUser } from '../../apollo/resolvers';
import PostCardList from '../../apollo-wrapped-components/PostCardList';
import { RouteComponentProps } from '@reach/router';
import { useQuery } from '@apollo/react-hooks';

interface Props extends RouteComponentProps { };

export default function (props: Props) {
  const { data } = useQuery<GetPosts>(POSTS);
  const { data: user_data } = useQuery<GetUser>(GET_USER);
  const user = user_data && user_data.getUser ? user_data.getUser : null;

  const posts = data && data.posts ? data.posts : null;

  return (
    <div>
      <h1>Dashboard</h1>
      {
        user && posts && (
          <PostCardList posts={posts} is_owner={false} user={user} />
        )
      }
    </div>
  );
};
