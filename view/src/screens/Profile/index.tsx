import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers';
import { $PropertyType } from 'utility-types';
import { gqlUserPosts } from '../../redux/actions/gql-thunks';
import PostCardList from '../../redux-wrapped-components/PostCardList';
import { RouteComponentProps } from '@reach/router';

interface Props {
  posts: $PropertyType<AppState, 'user_posts'>,
  gqlUserPosts: (variables: void) => void
}

class Profile extends Component<Props & RouteComponentProps> {
  componentWillMount() {
    this.props.gqlUserPosts();
  }

  render() {
    const { posts } = this.props;

    return (
      <div>
        <div>Profile</div>
        {
          // there is an issue with connect typescript
          // it doesn't correctly pass required props
          // TO DO: find more appropriate solution.
          // @ts-ignore
          posts && <PostCardList posts={posts} is_owner={true} />
        }
      </div>
    );
  }
};

function mapStateToProps(state: AppState) {
  return {
    posts: state.user_posts
  }

}

export default connect(mapStateToProps, { gqlUserPosts })(Profile);