import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../redux/reducers';
import { $PropertyType } from 'utility-types';
import { gqlPosts } from '../../redux/actions/gql-thunks';
import { GetPostsVariables } from '../../graphql/operation-result-types';

interface Props {
  posts: $PropertyType<AppState, 'dashboard_posts'>;
  gqlPosts: (variables?: GetPostsVariables) => void
}

class Dashboard extends Component<Props> {
  componentWillMount() {
    this.props.gqlPosts();
  }

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
    posts: state.dashboard_posts
  }
}



export default connect(mapStateToProps, { gqlPosts })(Dashboard);