
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
  commentIconsWrapper: {
    transform: `translateY(-${theme.spacing.unit * 2}px)`,
  },
  listItem: {
    minHeight: `${theme.spacing.unit * 10}px`
  }
});

export default styles;

export type CommentListStyles = WithStyles<typeof styles>;