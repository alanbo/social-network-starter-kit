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
import { loginUser } from '../../redux/actions/userActions';

interface Props extends LoginStyles, RouteComponentProps<any> {
  loginUser: (email: string, password: string) => void
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
    this.props.loginUser(this.state.user_name, this.state.password);
  }

  render() {
    const { classes } = this.props;
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
            Login
          </Button>
        </div>
      </div>
    );
  }
};

export default connect(null, { loginUser })(withRouter(withStyles(styles)(Login)));