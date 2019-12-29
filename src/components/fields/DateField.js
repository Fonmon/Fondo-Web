import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'

const styles = {
    border: 'none', 
    outline: 'none'
}

export default function DateField(props) {
    return (
        <div>
            <InputLabel htmlFor="dateField">{props.label}</InputLabel>
            <input type="date" style={{...props.style, ...styles}}
                id="dateField"
                min={props.min}
                max={props.max}
                onChange={props.onChange}
                value={props.value}
                disabled={props.disabled}
            />
        </div>
    )
}