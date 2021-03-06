import red from '@material-ui/core/colors/red';
import { createStyles, WithStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
  card: {
    maxWidth: 800,
    marginBottom: theme.spacing(4),
    width: '100%'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  avatarRoot: {
    position: 'absolute'
  },
  textInputWrapper: {
    paddingRight: `${theme.spacing(2)}px`,
    paddingLeft: `${theme.spacing(2)}px`,
    display: 'flex',
    alignItems: 'stretch',
    flex: 1
  },
  cardHeader: {
    position: 'relative'
  },
});

export default styles;
export interface PostCardStyles extends WithStyles<typeof styles> { };