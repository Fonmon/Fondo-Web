import React from 'react';
import TextField from '@material-ui/core/TextField';
import NumberFormat from 'react-number-format';

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            prefix="$"
        />
    );
}

export default function CurrencyField(props) {
    return (
        <TextField {...props}
            InputProps={{
                inputComponent: NumberFormatCustom,
            }}
        />
    )
}