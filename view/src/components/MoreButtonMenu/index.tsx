import React from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper, { PopperPlacementType } from '@material-ui/core/Popper';
import { withStyles } from '@material-ui/core/styles';
import styles, { MoreButtonMenuStyles } from './styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';

interface Props extends MoreButtonMenuStyles {
  children: React.ReactNode | React.ReactNodeArray,
  placement?: PopperPlacementType
}

interface State {
  open: boolean,
}

class MenuListComposition extends React.Component<Props, State> {
  state = {
    open: false,
  };

  anchor_ref: HTMLButtonElement | null = null;

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = (event: React.ChangeEvent<{}>) => {
    if (this.anchor_ref && this.anchor_ref.contains(event.target as Node)) {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    const { classes, placement } = this.props;
    const { open } = this.state;

    return (
      <div className={classes.root}>
        <div>
          <IconButton
            buttonRef={(node: HTMLButtonElement) => {
              this.anchor_ref = node;
            }}
            aria-owns={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={this.handleToggle}
          >
            <MoreVertIcon />
          </IconButton>
          <Popper
            open={open}
            anchorEl={this.anchor_ref}
            transition disablePortal
            placement={placement || 'left-start'}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    {this.props.children}
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(MenuListComposition);