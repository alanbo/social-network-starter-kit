import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
  commentIconsWrapper: {
    transform: `translateY(-${theme.spacing.unit * 2}px)`,
  },
  listItem: {
    minHeight: `${theme.spacing.unit * 10}px`
  }
});

export default styles;

export type CommentItemStyles = WithStyles<typeof styles>;

