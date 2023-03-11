import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
} from "@material-ui/core";
import React from "react";

import Utils from '../../utils/Utils';
import ContainerComponent from "../base/ContainerComponent";
import LoadingMaskComponent from "../base/LoadingMaskComponent";

import ContentAdd from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import CurrencyField from "../fields/CurrencyField";

const ButtonsActions = (props) => {
  return (
    <div>
      <IconButton onClick={props.onAdd.bind(this, props.id)}><ContentAdd /></IconButton>
      <IconButton onClick={props.onCancel.bind(this, props.id)}><CancelIcon /></IconButton>
    </div>
  );
}

export default class CapsListPage extends ContainerComponent {
  constructor(props) {
    super(props)
    this.state = {
      caps: [],
      currentPage: 1,
      totalPages: 1,
      count: 0,
      loading: false,
      filterValue: 0,
      openMessage: false,
      errorMessage: '',
      updateCAP: {
        cancelOpen: false,
        setValueOpen: false,
        newValueError: '',
        newValue: '',
        cap: {},
      }
    }
  }

  componentDidMount = () => {
    this.getCapsList(1, this.state.filterValue)
  }

  getCapsList(page, filterValue) {
    this.setState({
      loading: true,
      currentPage: page
    })
    Utils.getCaps(page, this.props.isManage, filterValue)
      .then((response) => {
        this.setState({
          totalPages: response.data.num_pages,
          count: response.data.count,
          caps: response.data.list,
          loading: false
        });
      }).catch((error) => {
        this.setState({ loading: false });
        this.handleRequestError(error);
      });
  }

  applyFilter = (event) => {
    this.setState({ filterValue: event.target.value });
    this.getCapsList(1, event.target.value);
  }

  onRowSelection = () => {
    if (!this.props.isManage) {
      // TODO: is it going to be necessary?
    }
  }

  setUpdateCapState = (props) => {
    this.setState({
      updateCAP: {
        ...this.state.updateCAP,
        ...props
      }
    })
  }

  handleClose = () => {
    this.setUpdateCapState({
      cancelOpen: false,
      setValueOpen: false,
    });
  }

  handleCancelCAP = () => {
    this.setState({
      loading: true,
    })
    Utils.updateCap({
      id: this.state.updateCAP.cap.id,
      state: 1,
      value: this.state.updateCAP.cap.value,
    }).then(() => {
        this.handleClose();
        this.getCapsList(1, this.state.filterValue)
      }).catch((error) => {
        this.setState({ loading: false });
        this.handleRequestError(error);
      });
  }

  handleSetValue = () => {
    this.setState({
      loading: true,
    })
    Utils.updateCap({
      id: this.state.updateCAP.cap.id,
      state: this.state.updateCAP.cap.state,
      value: this.state.updateCAP.newValue,
    }).then(() => {
        this.handleClose();
        this.getCapsList(1, this.state.filterValue)
      }).catch((error) => {
        this.setState({ loading: false });
        this.handleRequestError(error);
      });
  }

  render() {
    const cancelActions = [
      <Button color="primary" key="no"
        onClick={this.handleClose}>No</Button>,
      <Button color="primary" key="si"
        variant="contained"
        onClick={this.handleCancelCAP}>Si</Button>,
    ];
    const newValueActions = [
      <Button color="primary" key="no"
        onClick={this.handleClose}>Cancelar</Button>,
      <Button color="primary" key="si"
        variant="contained"
        onClick={this.handleSetValue}>Actualizar</Button>,
    ];
    return (
      <React.Fragment>
        <ContainerComponent showHeader={true}
          loadinMask={this.state.loading}
          renderOneFullColGrid={true}
          middle={
            <Paper className="TableLoan" elevation={20}>
              <LoadingMaskComponent active={this.state.loading} />
              <Toolbar style={{ background: 'white', overflow: 'hidden' }}>
                <InputLabel htmlFor="filter" style={{ marginRight: 10 }}>Filtrar por: </InputLabel>
                <Select value={this.state.filterValue}
                  onChange={this.applyFilter}
                  inputProps={{
                    id: "filter"
                  }}
                >
                  <MenuItem value={0}>Activas</MenuItem>
                  <MenuItem value={1}>Cerradas</MenuItem>
                </Select>
              </Toolbar>
              <div style={{ overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        colSpan={this.props.isManage ? '6' : '4'}
                        style={{ textAlign: 'center' }}
                      >
                        Cuentas de Ahorro Programado
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      {this.props.isManage &&
                        <TableCell>Creador</TableCell>
                      }
                      <TableCell>Fecha creación</TableCell>
                      <TableCell>Fecha cierre</TableCell>
                      <TableCell>Valor</TableCell>
                      {this.props.isManage && this.state.filterValue === 0 &&
                        <TableCell>Acciones</TableCell>
                      }
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.caps.map((cap, i) => {
                      return (
                        <TableRow key={i} hover={!this.props.isManage}
                          onClick={(_) => this.onRowSelection(cap.id)}
                        >
                          <TableCell>{cap.id}</TableCell>
                          {this.props.isManage &&
                            <TableCell>{cap.user_full_name}</TableCell>
                          }
                          <TableCell>{cap.created_at}</TableCell>
                          <TableCell>{cap.end_date}</TableCell>
                          <TableCell>${Utils.parseNumberMoney(cap.value)}</TableCell>
                          {this.props.isManage && this.state.filterValue === 0 &&
                            <TableCell>
                              <ButtonsActions
                                onAdd={() => this.setUpdateCapState({
                                  setValueOpen: true,
                                  cap,
                                })}
                                onCancel={() => this.setUpdateCapState({
                                  cancelOpen: true,
                                  cap,
                                })}
                              />
                            </TableCell>
                          }
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <TablePagination
                component="div"
                count={this.state.count}
                rowsPerPage={10}
                rowsPerPageOptions={[]}
                page={this.state.currentPage - 1}
                backIconButtonProps={{
                  'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'Next Page',
                }}
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                onChangePage={(event, page) => this.getCapsList(page + 1, this.state.filterValue)}
              />
            </Paper>
          }
        />
        <Snackbar open={this.state.openMessage}
          message={this.state.errorMessage}
          autoHideDuration={4000}
          onClose={(event) => this.setState({ openMessage: false })}
        />
        <Dialog aria-labelledby="confirmation-dialog-title"
          open={this.state.updateCAP.cancelOpen}
        >
          <DialogTitle id="confirmation-dialog-title">Confirmación</DialogTitle>
          <DialogContent>
            ¿Seguro que desea cerrar esta cuenta?
          </DialogContent>
          <DialogActions>{cancelActions}</DialogActions>
        </Dialog>
        <Dialog aria-labelledby="confirmation-dialog-title"
          open={this.state.updateCAP.setValueOpen}
        >
          <DialogTitle id="confirmation-dialog-title">Cambiar monto</DialogTitle>
          <DialogContent>
            Ingrese el nuevo valor de la CAP
            <CurrencyField label=""
              style={{ width: '100%' }}
              value={this.state.updateCAP.newValue}
              helperText={this.state.updateCAP.newValueError}
              error={this.state.updateCAP.newValueError !== ''}
              onChange={(event) => this.setUpdateCapState({ newValue: event.target.value })}
            />
          </DialogContent>
          <DialogActions>{newValueActions}</DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}