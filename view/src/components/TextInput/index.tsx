import React, { ChangeEvent, Component, } from 'react';
import TextField from '@material-ui/core/TextField';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { withStyles } from '@material-ui/core/styles';
import styles, { CommentInputStyles } from './styles';

const HELPER_INFO = "Press ENTER to submit. Press Shift+ENTER for the newline";
const HELPER_ERROR = "Can't submit an empty text";

interface Props extends CommentInputStyles {
  onSubmit: (message: string) => void,
  onCancel?: () => void,
  label: string,
  message?: string
}

interface State {
  comment_msg: string
  textarea_error: Boolean
  is_focused: Boolean
}

class TextInput extends Component<Props, State> {
  state = {
    comment_msg: '',
    textarea_error: false,
    is_focused: false,
  }

  text_ref: HTMLTextAreaElement | null = null;

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.message && !state.comment_msg) {
      return {
        comment_msg: props.message
      }
    }

    return null;
  }


  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const comment_msg = e.target.value;

    this.setState({ comment_msg });

    // remove error when value is not empty
    if (this.state.textarea_error && comment_msg.match(/[a-zA-Z]/g)) {
      this.setState({ textarea_error: false });
    }
  };

  keyboardListener = (e: KeyboardEvent) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault()

      const message = this.state.comment_msg;

      // only submit when message is not empty
      if (!this.state.comment_msg.match(/[a-zA-Z]/g)) {
        this.setState({ textarea_error: true });
        return;
      }

      this.setState({ comment_msg: '' });

      this.text_ref && this.text_ref.blur();

      setTimeout(() => {
        this.props.onSubmit(message);
      }, 0);

    } else if (e.keyCode === 27) {
      this.onCancel();
    }
  }

  setInputRef = (textarea: HTMLTextAreaElement) => {
    if (!textarea) {
      return;
    }

    this.text_ref = textarea;
    this.text_ref.addEventListener('keydown', this.keyboardListener);
  }

  onTextFocus() {
    this.setState({ is_focused: true });
  }

  onTextBlur() {
    // remove error on blur
    this.setState({ is_focused: false, textarea_error: false });
  }

  onCancel = () => {
    this.text_ref && this.text_ref.blur();
    // timeout so that cancel callback fires after blur event callback
    this.props.onCancel && this.props.onCancel()
  }

  componentWillUnmount() {
    if (this.text_ref) {
      this.text_ref.removeEventListener('keydown', this.keyboardListener);
    }
  }

  render() {
    const { classes, label } = this.props;

    let helper_text: false | string = false;

    if (this.state.textarea_error) {
      helper_text = HELPER_ERROR;
    } else if (this.state.is_focused) {
      helper_text = HELPER_INFO;
    };

    return (
      <ClickAwayListener onClickAway={this.onCancel}>
        <TextField
          label={label}
          multiline
          rowsMax="4"
          autoFocus={true}
          value={this.state.comment_msg}
          onChange={this.handleChange}
          className={classes.textField}
          margin="normal"
          variant="outlined"
          inputRef={this.setInputRef}
          error={this.state.textarea_error}
          helperText={helper_text}
          onFocus={this.onTextFocus.bind(this)}
          onBlur={this.onTextBlur.bind(this)}
        />
      </ClickAwayListener>
    );
  }
}

export default withStyles(styles)(TextInput);