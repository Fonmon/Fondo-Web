import React, { Component } from 'react'
import InputLabel from '@material-ui/core/InputLabel'

const styles = {
    border: 'none', 
    outline: 'none'
}

export default class DateField extends Component {
    render() {
        return (
            <div>
                <InputLabel htmlFor="dateField">{this.props.label}</InputLabel>
                <input type="date" style={{...this.props.style, ...styles}}
                    id="dateField"
                    min={this.props.min}
                    max={this.props.max}
                    onChange={this.props.onChange}
                    value={this.props.value}
                    disabled={this.props.disabled}
                />
            </div>
        )
    }
}