import PostCardList from '../components/PostCardList';
import {
  gqlAddComment,
  gqlRemoveComment,
  gqlUpdateComment,
  gqlUpdatePost,
  gqlDeletePost
} from '../redux/actions/gql-thunks';
import { AppState } from '../redux/reducers';
import { connect } from 'react-redux';


function mapStateToProps(state: AppState) {
  return {
    user: state.user
  }
}


export default connect(mapStateToProps, {
  onAddComment: gqlAddComment,
  onRemoveComment: gqlRemoveComment,
  onUpdateComment: gqlUpdateComment,
  onUpdatePost: gqlUpdatePost,
  onDeletePost: gqlDeletePost
})(PostCardList);