import React from 'react';
import { Paper, Snackbar, InputLabel, Select, MenuItem, Button } from '@material-ui/core';

import ContainerComponent from '../../base/ContainerComponent';
import LoadingMaskComponent from '../../base/LoadingMaskComponent';
import DateField from '../../fields/DateField'
import Utils from '../../../utils/Utils';

export default class PowerPage extends ContainerComponent {

  constructor() {
    super();
    this.state = {
      openMessage: false,
      errorMessage: '',
      requestsSent: [],
      requestsReceived: [],
      users: [],
      date: null,
      user: 0
    }
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers() {
    this.setState({
      loading: true
    });
    Utils.getUsers()
      .then((response) => {
        this.setState({
          users: response.data.list,
          loading: false
        });
      }).catch((error) => {
        this.setState({ loading: false });
        this.handleRequestError(error);
      });
  }

  sendRequest() {
    if (!this.state.date || !this.state.user) {
      return this.showMessageError("Por favor llenar todos los campos.")
    }
  }

  render() {
    return (
      <div>
        <LoadingMaskComponent active={this.state.loading} />
        <ContainerComponent showHeader={true}
          renderTwoColGrid={true}
          leftWidth={4}
          left={
            <Paper className="UserInfo" elevation={20}>
              <h3 style={{ textAlign: 'center' }}>Enviar poder</h3>
              <DateField label="Fecha de la reunion"
                style={{ width: '100%' }}
                onChange={(event) => this.setState({ date: event.target.value })}
              />
              <br />
              <InputLabel htmlFor="user">
                Apoderado
              </InputLabel>
              <Select value={this.state.user}
                inputProps={{
                  id: "user"
                }}
                style={{ width: '100%' }}
                onChange={(event) => this.setState({ user: event.target.value })}
              >
                {this.state.users.map((user, index) => {
                  return <MenuItem key={user.id} value={user.id}>{user.full_name}</MenuItem>
                })}
              </Select>
              <br /><br />
              <Button style={{width:'100%'}}
                color="primary"
                variant="contained"
                onClick={this.sendRequest.bind(this)}
              >
                Enviar solicitud
              </Button>
            </Paper>
          }
          rightWidth={8}
          right={
            <div>
              <Paper className="UserInfo" elevation={20}>
                <h3 style={{ textAlign: 'center' }}>Peticiones recibidas</h3>
              </Paper>
              <Paper className="UserInfo" elevation={20}>
                <h3 style={{ textAlign: 'center' }}>Peticiones enviadas</h3>
              </Paper>
            </div>
          }
        />
        <Snackbar open={this.state.openMessage}
          message={this.state.errorMessage}
          autoHideDuration={4000}
          onClose={() => this.setState({ openMessage: false })}
        />
      </div>
    )
  }
}