import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers';
import { UserPostsState } from '../../redux/reducers/userPostsReducer';
import { $PropertyType } from 'utility-types';

interface Props {
  posts: $PropertyType<AppState, 'user_posts'>;
}

class Dashboard extends Component<Props> {
  render() {
    const { posts } = this.props;

    return (
      <div>
        <h1>Dashboard</h1>

        {
          posts && posts.map(post => (
            <p>{post.message}</p>
          ))
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



export default connect(mapStateToProps)(Dashboard);