import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
  post_container: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    flexWrap: 'wrap'
  }
});

export default styles;
export type PostCardListStyles = WithStyles<typeof styles>;