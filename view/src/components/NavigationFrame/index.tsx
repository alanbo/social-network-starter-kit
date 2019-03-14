import * as React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import styles from './styles';
import MenuList, { DataItem } from './MenuList';

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

interface Props {
  classes: {
    root: string,
    appBar: string,
    appBarShift: string,
    menuButton: string,
    hide: string,
    flex: string,
    drawerPaper: string,
    drawerPaperClose: string,
    toolbar: string,
    content: string,
  },
  signOut: () => any,
  children: React.ReactNode
}

interface State {
  open: boolean
}

class NavigationFrame extends React.Component<Props, State> {
  state = {
    open: false,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

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
          <MenuList signOut={this.props.signOut} fragments_list={fg_list} />
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {this.props.children}
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(NavigationFrame);
