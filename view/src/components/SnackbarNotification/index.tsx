import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import React, { Component, ComponentType } from 'react';
import { connect } from 'react-redux';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
import IconButton from '@material-ui/core/IconButton';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import classNames from 'classnames';
import { User } from '../../apollo/types/user';

import { withStyles } from '@material-ui/core/styles';
import styles, { SnackbarNotificationStyles } from './styles';
import { $PropertyType } from 'utility-types';

const AUTOHIDE_DURATION: { [ix: string]: number | undefined } = {
  error: undefined,
  info: 1000,
  warning: 2000,
  success: 1000
}

const variantIcon: { [ix: string]: ComponentType<SvgIconProps> } = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

interface Props extends SnackbarNotificationStyles {
  notification: Notification | null,
  clearNotification: (id: string) => void
}

export interface Notification {
  type: 'error' | 'info' | 'success',
  msg: string,
  id: string
}

interface State {
  notification_type: $PropertyType<Notification, 'type'>;
  message: ''
}


class SnackbarNotification extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      notification_type: 'info',
      message: ''
    }
  }

  // notification_set state needs to be set
  // so that animation doesn't change color
  static getDerivedStateFromProps(props: Props) {
    const { notification } = props;

    if (notification) {
      return {
        notification_type: notification.type,
        message: notification.msg
      }
    }

    return null;
  }

  render() {
    const { notification, classes } = this.props;
    const { notification_type, message } = this.state;
    const Icon = variantIcon[notification_type];

    return (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={!!notification}
        autoHideDuration={notification ? AUTOHIDE_DURATION[notification_type] : undefined}
        onClose={() => {
          if (notification) {
            this.props.clearNotification(notification.id);
          }
        }}
        onExited={() => {
          this.setState({ notification_type: 'info', message: '' })
        }}
      >
        <SnackbarContent
          className={classes[notification_type]}
          message={
            <span id="client-snackbar" className={classes.message}>
              <Icon className={classNames(classes.icon, classes.iconVariant)} />
              {message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => {
                if (notification) {
                  this.props.clearNotification(notification.id);
                }
              }}
            >
              <CloseIcon className={classes.icon} />
            </IconButton>,
          ]}
        />
      </ Snackbar>
    );
  }
}


export default withStyles(styles)(SnackbarNotification);