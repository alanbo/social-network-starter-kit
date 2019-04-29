import * as React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import styles, { NavigationFrameStyles } from './styles';
import MenuList, { DataItem } from './MenuList';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { gqlLogout } from '../../redux/actions/gql-thunks';
import { AppState } from '../../redux/reducers';
import { UserState } from '../../redux/reducers/userReducer';
import LoadingIndicator from '../LoadingIndicator';

const fg_list: Array<DataItem> = [
  {
    path: '/',
    type: 'Dashboard',
    icon: 'home'
  },
  {
    path: '/profile',
    type: 'Profile',
    icon: 'account_box'
  },
  {
    path: '/bookmarks',
    type: 'Bookmarks',
    icon: 'bookmarks'
  },
  {
    path: '/settings',
    type: 'Settings',
    icon: 'settings'
  }
];

interface Props extends NavigationFrameStyles {
  signOut: () => any,
  children: React.ReactNode,
  gqlLogout: Function,
  user: UserState,
  loading: Boolean
}

interface State {
  open: boolean
}

class NavigationFrame extends React.Component<Props, State> {
  state = {
    open: false,
  };

  signOut() {
    this.props.gqlLogout();
    this.props.signOut();
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, user } = this.props;

    return (
      <div className={classes.root}>
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
        >
          <Toolbar disableGutters={!this.state.open}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, this.state.open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>

            {
              user && (
                <Grid container justify="flex-end" alignItems="center">
                  {`${user.first_name} ${user.last_name}`}
                  <Avatar alt={'Profile Photo'} src="https://picsum.photos/300/300" className={classes.avatar} />
                </Grid>
              )
            }
          </Toolbar>

        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <MenuList signOut={this.signOut.bind(this)} fragments_list={fg_list} />
        </Drawer>
        <main className={classes.content}>
          {this.props.children}
          {this.props.loading && <LoadingIndicator />}
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(NavigationFrame);

