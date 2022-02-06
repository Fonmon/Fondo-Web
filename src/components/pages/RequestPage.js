import { Grid, Paper } from '@material-ui/core'
import React from 'react'
import ContainerComponent from '../base/ContainerComponent'

import '../../resources/styles/RequestPage.css';

export default function RequestPage(props) {
  return (
    <ContainerComponent
      showHeader={true}
      renderOneMidColGrid={true}
      middle={
        <Grid container>
          <Grid item xs={12} md={6}>
            <Paper 
              className="ButtonOpt" 
              elevation={20}
              onClick={() => props.history.push('/request-loan')}
            >
              <p className='TextBtn'>
                Solicitud de credito ordinario
              </p>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper 
              className="ButtonOpt" 
              elevation={20}
              onClick={() => props.history.push('/request-cap')}
            >
              <p className='TextBtn'>
                Cuenta de Ahorro Programado (CAP)
              </p>
            </Paper>
          </Grid>
        </Grid>
      }
    />
  )
}