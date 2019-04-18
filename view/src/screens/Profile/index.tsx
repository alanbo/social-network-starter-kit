import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers';
import { $PropertyType } from 'utility-types';
import { gqlUserPosts } from '../../redux/actions/gql-thunks';
import PostCardList from '../../components/PostCardList';

interface Props {
  posts: $PropertyType<AppState, 'user_posts'>,
  gqlUserPosts: (variables: void) => void
}

class Profile extends Component<Props> {
  componentWillMount() {
    this.props.gqlUserPosts();
  }

  render() {
    const { posts } = this.props;

    return (
      <div>
        <div>Profile</div>
        {
          posts && <PostCardList posts={posts} />
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