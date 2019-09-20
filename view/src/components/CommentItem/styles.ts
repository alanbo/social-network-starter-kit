import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
  commentIconsWrapper: {
    transform: `translateY(-${theme.spacing(2)}px)`,
  },
  listItem: {
    minHeight: `${theme.spacing(10)}px`
  },
  textInputWrapper: {
    paddingRight: `${theme.spacing(2)}px`,
    paddingLeft: `${theme.spacing(2)}px`,
    display: 'flex',
    alignItems: 'stretch',
    flex: 1
  }
});

export default styles;

export type CommentItemStyles = WithStyles<typeof styles>;

