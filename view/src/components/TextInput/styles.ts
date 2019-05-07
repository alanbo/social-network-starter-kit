import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
  textField: {
    width: '100%',
    marginBottom: theme.spacing.unit * 4
  },
});

export default styles;
export type CommentInputStyles = WithStyles<typeof styles>;