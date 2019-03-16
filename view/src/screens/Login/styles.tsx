import { createStyles, WithStyles } from '@material-ui/core/styles';

const styles = () => createStyles({
  input: {
    marginTop: 20,
    marginBottom: 20,
    width: '100%'
  },

  login_form_outer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  login_form_wrapper: {
    maxWidth: '500px',
    width: '300px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end'
  },

  button: {

  }
});

export default styles;

export interface LoginStyles extends WithStyles<typeof styles> { };