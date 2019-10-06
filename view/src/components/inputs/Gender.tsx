import React, { forwardRef } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(3),
      marginLeft: 0,
      width: '100%'
    },
    radioGroup: {
      flexDirection: 'row'
    },

    firstRadio: {
      marginLeft: 0
    }
  }),
);

export type TGender = 'male' | 'female' | 'other';

export interface Props {
  onChange: (value: TGender) => void
  error?: boolean,
  value?: TGender,
  // name: string
}

export default forwardRef<HTMLInputElement, Props>((props, ref) => {
  const classes = useStyles({});

  return (
    <FormControl className={classes.formControl}>
      <FormLabel component="legend">Gender</FormLabel>
      <RadioGroup
        // name={props.name}
        value={props.value}
        innerRef={ref}
        onChange={(_, value) => props.onChange(value as TGender)}
        classes={{
          root: classes.radioGroup
        }}
      >
        <FormControlLabel
          value="female"
          control={<Radio color="primary" />}
          label="Female"
          labelPlacement="start"
          classes={{
            root: classes.firstRadio
          }}
        />
        <FormControlLabel
          value="male"
          control={<Radio color="primary" />}
          label="Male"
          labelPlacement="start"
        />
        <FormControlLabel
          value="other"
          control={<Radio color="primary" />}
          label="Other"
          labelPlacement="start"
        />
      </RadioGroup>
    </FormControl>
  );
});