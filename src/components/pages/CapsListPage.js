import {
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

    }
  }

  render() {
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
                        colSpan={this.props.isManage ? '5' : '4'}
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
      </React.Fragment>
    )
  }
}