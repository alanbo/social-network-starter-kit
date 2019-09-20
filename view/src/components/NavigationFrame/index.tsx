import React, { useState } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MenuList, { DataItem } from './MenuList';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import LoadingIndicator from '../LoadingIndicator';
import { User } from '../../apollo/client-schema';
import useStyles from './styles';

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
  signOut: () => any,
  children: React.ReactNode,
  user: User | null,
  // loading: Boolean
}

interface State {
  open: boolean
}

export default (props: Props) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  function signOut() {
    props.signOut();
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { user } = props;
  let user_string = '';

  if (user) {
    if (user.given_name) {
      user_string = user.given_name;

      if (user.family_name) {
        user_string += ` ${user.family_name}`;
      }
    } else if (user.nickname) {
      user_string = user.nickname;
    } else {
      user_string = user.email;
    }
  }

  return (
    <div className={classes.root}>
      <AppBar
        position="absolute"
        className={classNames(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar disableGutters={!open}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={classNames(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>

          {
            user && (
              <Grid container justify="flex-end" alignItems="center">
                {user_string}
                <Avatar alt={'Profile Photo'} src="https://picsum.photos/300/300" className={classes.avatar} />
              </Grid>
            )
          }
        </Toolbar>

      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: classNames(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <MenuList signOut={signOut} fragments_list={fg_list} />
      </Drawer>
      <main className={classes.content}>
        {props.children}
        {/* {this.props.loading && <LoadingIndicator />} */}
      </main>
    </div>
  );
}

