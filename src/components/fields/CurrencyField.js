import React from 'react';
import TextField from 'material-ui/TextField';
import NumberFormat from 'react-number-format';

export default class CurrencyField extends TextField{
    render(){
        return (
            <TextField {...this.props} >
                <NumberFormat value={this.props.value} 
                    thousandSeparator={true} 
                    prefix={'$'}
                    onValueChange={(values) => this.props.onChange(null,values.floatValue)} />
            </TextField>
        )
    }
}