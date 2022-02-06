import {
  Grid,
  Paper,
  Button,
  Snackbar,
} from '@material-ui/core';
import React from 'react'
import ContainerComponent from '../base/ContainerComponent';
import LoadingMaskComponent from '../base/LoadingMaskComponent';
import DateField from '../fields/DateField'
import Utils from '../../utils/Utils';

class RequestCapPage extends ContainerComponent {
  constructor() {
    super()
    this.state = {
      openMessage: false,
      errorMessage: '',
      loading: false,
      limit_date: null,
    }
  }

  handleSubmit() {
    let isError = false;
    if (!this.state.limit_date) {
      isError = true;
      this.setState({ openMessage: true, errorMessage: 'Fecha limite de ahorro requerida o inválida' });
    }
    if (!isError) {

    }
  }

  render() {
    return (
      <React.Fragment>
        <LoadingMaskComponent active={this.state.loading} />
        <ContainerComponent
          showHeader={true}
          renderOneMidColGrid={true}
          middle={
            <Paper className='UserInfo' elevation={20}>
              <h2 style={{ textAlign: 'center' }}>Cuenta de Ahorro Programado</h2>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <DateField min={Utils.formatDate(new Date())}
                    label="Fecha limite de ahorro"
                    style={{ width: '100%' }}
                    onChange={(event) => this.setState({ limit_date: event.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button color='primary'
                    variant="contained"
                    style={{ width: '100%' }}
                    onClick={this.handleSubmit.bind(this)}
                  >
                    Crear
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          }
        />
        <Snackbar open={this.state.openMessage}
          message={this.state.errorMessage}
          autoHideDuration={4000}
          onClose={(event) => this.setState({ openMessage: false })}
        />
      </React.Fragment>
    )
  }
}

export default RequestCapPage