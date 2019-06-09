import React, { Component } from 'react';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';

export default class ColorPickerComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayColorPicker: false,
            color: this.props.color
        }
    }

    componentWillReceiveProps(nextValue) {
        this.setState({ color: nextValue.color })
    }

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false });
        this.props.onSave();
    };

    render() {
        const styles = reactCSS({
            'default': {
                color: {
                    width: '36px',
                    height: '14px',
                    borderRadius: '2px',
                    background: `${this.state.color}`,
                },
                swatch: {
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
                container: {
                    padding: '4px',
                    paddingRight: '8px',
                },
            },
        });
        return (
            <div style={styles.container}>
                <div style={styles.swatch} onClick={this.handleClick}>
                    <div style={styles.color} />
                </div>
                {this.state.displayColorPicker && !this.props.disabled? 
                    <div style={styles.popover}>
                        <div style={styles.cover} onClick={this.handleClose} />
                        <SketchPicker color={this.state.color} onChange={(color) => this.props.onChange(color.hex, this.props.type)} />
                    </div> : null}
            </div>
        )
    }
}