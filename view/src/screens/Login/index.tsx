import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core';
import styles, { LoginStyles } from './styles';

interface Props extends LoginStyles {

}

interface State {
  password: string,
  showPassword: Boolean,
  user_name: string
}


class Login extends Component<Props, State> {
  state = {
    password: '',
    showPassword: false,
    user_name: ''
  }

  handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: event.target.value });
  };

  handleChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ user_name: event.target.value });
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.login_form_outer}>
        <div className={classes.login_form_wrapper}>
          <h1>Login</h1>
          <FormControl classes={{ root: classes.input }}>
            <InputLabel htmlFor="input-with-icon-adornment">Email</InputLabel>
            <Input
              id="input-with-icon-adornment"
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
            />
          </FormControl>

          <FormControl classes={{ root: classes.input }}>
            <InputLabel htmlFor="adornment-password">Password</InputLabel>
            <Input
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
        </div>
      </div>
    );
  }
};

export default withStyles(styles)(Login);