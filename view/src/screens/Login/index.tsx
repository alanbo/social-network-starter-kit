import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';
import styles, { LoginStyles } from './styles';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { gqlLogin } from '../../redux/actions/gql-thunks';
import { LoginVariables } from '../../graphql/operation-result-types';
import { AppState } from '../../redux/reducers';
import { Redirect } from 'react-router';

interface Props extends LoginStyles, RouteComponentProps<any> {
  gqlLogin: (variables: LoginVariables) => void,
  is_logged_in: Boolean
}

interface State {
  password: string,
  showPassword: Boolean,
  user_name: string,
  error: Boolean
}


class Login extends Component<Props, State> {
  state = {
    password: '',
    showPassword: false,
    user_name: '',
    error: false
  }

  handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: event.target.value, error: false });
  };

  handleChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ user_name: event.target.value, error: false });
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  async handleSubmit() {
    const variables: LoginVariables = {
      password: this.state.password,
      email: this.state.user_name
    };

    this.props.gqlLogin(variables);
  }

  render() {
    const { classes, is_logged_in } = this.props;
    if (is_logged_in) {
      return <Redirect to='/' />
    }

    return (
      <div className={classes.login_form_outer}>
        <div className={classes.login_form_wrapper}>
          {this.state.error && <FormHelperText error={true}>Invalid Password Or Email</FormHelperText>}
          <FormControl classes={{ root: classes.input }}>
            <InputLabel htmlFor="input-with-icon-adornment" error={this.state.error}>Email</InputLabel>
            <Input
              error={this.state.error}
              id="input-with-icon-adornment"
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
              onChange={this.handleChangeUserName}
            />
          </FormControl>

          <FormControl classes={{ root: classes.input }}>
            <InputLabel htmlFor="adornment-password" error={this.state.error}>Password</InputLabel>
            <Input
              error={this.state.error}
              className={classes.input}
              id="adornment-password"
              type={this.state.showPassword ? 'text' : 'password'}
              value={this.state.password}
              onChange={this.handleChangePassword}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={this.handleClickShowPassword}
                  >
                    {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <Button variant="contained" className={classes.button} onClick={this.handleSubmit.bind(this)}>
            Login Testing
        </Button>
        </div>
      </div>
    );
  }
};

function mapStateToProps(state: AppState) {
  return {
    is_logged_in: !!state.user
  }
}

export default connect(mapStateToProps, { gqlLogin })(withRouter(withStyles(styles)(Login)));