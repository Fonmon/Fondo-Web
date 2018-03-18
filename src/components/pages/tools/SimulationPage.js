import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import ContainerComponent from '../../base/ContainerComponent';

class SimulationPage extends ContainerComponent{

    constructor(){
        super();
        this.state = {
            value:0,
            fee:0,
            timelimit:0,
            value_error:'',
            timelimit_error:'',
        }
    }

    render(){
        return (
            <ContainerComponent showHeader={true}
                renderOneMidColGrid={true}
                middle={
                    <div>
                        <Paper className="UserInfo" zDepth={5}>
                            <h3 style={{textAlign:'center'}}>Simulador de crédito</h3>
                            <TextField floatingLabelText="Valor a solicitar"
                                required={true}
                                style={{width:'100%'}}
                                type='number'
                                min={0}
                                errorText={this.state.value_error}
                                onChange = {(event,newValue) => this.setState({value:newValue})}
                            />
                            
                            <TextField hintText="Valor en meses"
                                floatingLabelText="Plazo"
                                required={true}
                                style={{width:'100%'}}
                                type='number'
                                min={1}
                                errorText={this.state.timelimit_error}
                                onChange = {(event,newValue) => this.setState({timelimit:newValue})}
                            />
                            <SelectField
                                floatingLabelText="Cuota"
                                value={this.state.fee}
                                style={{width:'100%'}}
                                onChange={(event,index,value) => this.setState({fee:value})}>
                                <MenuItem value={0} primaryText="Mensual" />
                                <MenuItem value={1} primaryText="Única" />
                            </SelectField>
                        </Paper>
                        <Paper className="UserInfo" zDepth={5}>
                        </Paper>
                    </div>
                }
            />
        )
    }
}

export default SimulationPage;