import { connect } from 'react-redux';
import { AppState } from '../redux/reducers';
import NavigationFrame from '../components/NavigationFrame';
import { gqlLogout } from '../redux/actions/gql-thunks';

function mapStateToProps(state: AppState) {
  return {
    user: state.user,
    loading: !!state.loading.length
  }
}
export default connect(mapStateToProps, { gqlLogout })(NavigationFrame);