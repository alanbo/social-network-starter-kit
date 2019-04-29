import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing.unit * 2,
  },
});

export default styles;

export type MoreButtonMenuStyles = WithStyles<typeof styles>;