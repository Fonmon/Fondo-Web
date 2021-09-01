import React from 'react';
import { Paper, Snackbar, InputLabel, Select, MenuItem, Button } from '@material-ui/core';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';

import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';

import ContainerComponent from '../../base/ContainerComponent';
import LoadingMaskComponent from '../../base/LoadingMaskComponent';
import DateField from '../../fields/DateField'
import Utils from '../../../utils/Utils';

const ButtonsActions = (props) => {
  return (
    <div>
      <IconButton onClick={props.onClick.bind(this, props.id, 1)}><DoneIcon /></IconButton>
      <IconButton onClick={props.onClick.bind(this, props.id, 2)}><CancelIcon /></IconButton>
    </div>
  );
}

export default class PowerPage extends ContainerComponent {
  constructor() {
    super();
    this.state = {
      openMessage: false,
      errorMessage: '',
      users: [],
      date: null,
      user: 0,
      sent: {
        currentPage: 1,
        totalPages: 1,
        list: [],
        count: 0,
      },
      received: {
        currentPage: 1,
        totalPages: 1,
        list: [],
        count: 0,
      }
    }
  }

  componentDidMount() {
    this.getUsers();
    this.getPowers(1, 'requested', 'sent');
    this.getPowers(1, 'requestee', 'received');
  }

  async getPowers(page, obj, state) {
    try {
      this.setState({ loading: true })
      const response = await Utils.userApps('power', {
        type: 'get',
        page, obj
      });
      this.setState({
        [state]: {
          list: response.data.list,
          currentPage: page,
          totalPages: response.data.num_pages,
          count: response.data.count
        }
      })
    } catch (error) {
      this.handleRequestError(error);
    } finally {
      this.setState({ loading: false })
    }
  }

  getUsers() {
    this.setState({
      loading: true
    });
    Utils.getUsers()
      .then((response) => {
        const users = response.data.list.filter(user => user.id !== Number(Utils.currentId()));
        this.setState({
          users,
          loading: false
        });
      }).catch((error) => {
        this.setState({ loading: false });
        this.handleRequestError(error);
      });
  }

  async sendRequest() {
    if (!this.state.date || !this.state.user) {
      return this.showMessageError("Por favor llenar todos los campos.")
    }
    try {
      this.setState({ loading: true });
      await Utils.userApps('power', {
        type: 'post',
        meeting_date: this.state.date,
        requestee: this.state.user
      })
      this.setState({
        user: 0
      })
      await this.getPowers(1, 'requested', 'sent');
      this.showMessageError("Solicitud enviada correctamente.")
    } catch (error) {
      this.handleRequestError(error);
    } finally {
      this.setState({ loading: false });
    }
  }

  resolveState = (state) => {
    switch (state) {
      case 0:
        return 'Pendiente'
      case 1:
        return 'Aprobado'
      case 2:
        return 'Rechazado'
      default:
        return null
    }
  }

  onPowerAction = async (powerId, state) => {
    try {
      this.setState({ loading: true });
      await Utils.userApps('power', {
        type: 'patch',
        id: powerId,
        state
      })
      this.getPowers(this.state.received.currentPage, 'requestee', 'received');
    } catch (error) {
      this.handleRequestError(error);
    } finally {
      this.setState({ loading: false });
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
              <Button style={{ width: '100%' }}
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
                {this.state.received.list.length === 0 &&
                  <h4 style={{ textAlign: 'center', fontWeight: 'normal' }}>No hay solicitudes.</h4>
                }
                {this.state.received.list.length !== 0 &&
                  <div style={{ overflowX: 'auto' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Fecha de la reunion</TableCell>
                          <TableCell>Enviado por</TableCell>
                          <TableCell>Estado</TableCell>
                          <TableCell>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.received.list.map((req, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell>{req.id}</TableCell>
                              <TableCell>{req.meeting_date}</TableCell>
                              <TableCell>{req.requester}</TableCell>
                              <TableCell>{this.resolveState(req.state)}</TableCell>
                              <TableCell>
                                {req.state === 0 &&
                                  <ButtonsActions
                                    id={req.id}
                                    onClick={this.onPowerAction}
                                  />
                                }
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    <TablePagination
                      component="div"
                      count={this.state.received.count}
                      rowsPerPage={10}
                      rowsPerPageOptions={[]}
                      page={this.state.received.currentPage - 1}
                      backIconButtonProps={{
                        'aria-label': 'Previous Page',
                      }}
                      nextIconButtonProps={{
                        'aria-label': 'Next Page',
                      }}
                      labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                      onChangePage={(_, page) => this.getPowers(page+1, 'requestee', 'received')}
                    />
                  </div>
                }
              </Paper>
              <Paper className="UserInfo" elevation={20}>
                <h3 style={{ textAlign: 'center' }}>Peticiones enviadas</h3>
                {this.state.sent.list.length === 0 &&
                  <h4 style={{ textAlign: 'center', fontWeight: 'normal' }}>No hay solicitudes.</h4>
                }
                {this.state.sent.list.length !== 0 &&
                  <div style={{ overflowX: 'auto' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Fecha de la reunion</TableCell>
                          <TableCell>Enviado a</TableCell>
                          <TableCell>Estado</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.sent.list.map((req, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell>{req.id}</TableCell>
                              <TableCell>{req.meeting_date}</TableCell>
                              <TableCell>{req.requestee}</TableCell>
                              <TableCell>{this.resolveState(req.state)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    <TablePagination
                      component="div"
                      count={this.state.sent.count}
                      rowsPerPage={10}
                      rowsPerPageOptions={[]}
                      page={this.state.sent.currentPage - 1}
                      backIconButtonProps={{
                        'aria-label': 'Previous Page',
                      }}
                      nextIconButtonProps={{
                        'aria-label': 'Next Page',
                      }}
                      labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                      onChangePage={(_, page) => this.getPowers(page + 1, 'requested', 'sent')}
                    />
                  </div>
                }
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