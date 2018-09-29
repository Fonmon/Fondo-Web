import React from 'react';
import Paper from '@material-ui/core/Paper';

import ContainerComponent from '../base/ContainerComponent';
import {SimulationIcon,ProjectionIcon,ActivitiesIcon} from '../../utils/SvgIcons';
import '../../resources/styles/Tools.css';

const listTools = (
    [
        {image: SimulationIcon, ref:'tool/simulation', text:'Simulador'},
        {image: ProjectionIcon, ref:'tool/projection', text:'Proyección pago'},
        {image: ActivitiesIcon, ref:'tool/activities', text:'Actividades'},
        {image: null, ref:null, text:'Próximamente'},
        {image: null, ref:null, text:'Próximamente'}
    ]
)

class ToolsListPage extends ContainerComponent{
    
    render(){
        return (
            <ContainerComponent showHeader={true}
                renderListColGrid={true}
                colsWidth={4}
                items={listTools.map((tool,i)=>{
                    return (
                        <Paper className={"ToolsCard " + (tool.ref ? "Active" : "Soon")}>
                            {tool.ref &&
                                <a href={tool.ref} className="ToolsButton">
                                    <img alt="" className="Svg" src={tool.image} />
                                </a>
                            }
                            <center><span className="ToolsLabel">
                                <strong>{tool.text}</strong>
                            </span></center>
                        </Paper>
                    )
                })}
            />
        )
    }
}

export default ToolsListPage;