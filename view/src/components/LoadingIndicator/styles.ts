import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
    transform: `translateX(-${theme.spacing(4)}px)`,
    position: 'fixed',
    bottom: 0
  }
});

export default styles;

export type LoadingIndicatorStyles = WithStyles<typeof styles>;