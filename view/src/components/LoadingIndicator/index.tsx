import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import styles, { LoadingIndicatorStyles } from './styles';

interface Props extends LoadingIndicatorStyles { };


function LinearIndeterminate(props: Props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <LinearProgress />
    </div>
  );
}

export default withStyles(styles)(LinearIndeterminate);