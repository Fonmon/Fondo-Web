import React from 'react';
import Paper from '@material-ui/core/Paper';
import {
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TablePagination
} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import DeleteIcon from '@material-ui/icons/Delete';
import OpenInNew from '@material-ui/icons/OpenInNew'

import ContainerComponent from '../base/ContainerComponent';
import Utils from '../../utils/Utils';
import CreateUserDialog from '../dialogs/CreateUserDialog';

const ButtonsActions = (props) => {
    return (
        <div>
            <IconButton onClick={props.onEdit.bind(this, props.id)}><OpenInNew /></IconButton>
            {Utils.isAdmin() && 
                <IconButton onClick={props.onRemove.bind(this, props.id)}><DeleteIcon /></IconButton>
            }
        </div>
    );
}

class UsersListPage extends ContainerComponent {
    constructor() {
        super();
        this.state = {
            openMessage: false,
            errorMessage: '',
            users: [],
            removeOpen: false,
            removeId: -1,
            createUserDialog: false,
            currentPage: 1,
            count: 0,
            totalPages: 1,
            loading: false
        }
        this.createUserKey = 1;
    }

    componentDidMount = () => {
        this.getUsers(1);
    }

    getUsers(page) {
        this.setState({ 
            currentPage: page,
            loading: true
        });
        Utils.getUsers(page)
            .then((response) => {
                this.setState({
                    totalPages: response.data.num_pages,
                    users: response.data.list,
                    count: response.data.count,
                    loading: false
                });
            }).catch((error) => {
                this.setState({ loading: false });
                this.handleRequestError(error);
            });
    }

    handleEditUser = (id) => {
        this.props.history.push(`/user/${id}`);
    }

    handleDialogRemoveUser = (id) => {
        this.setState({ 
            removeOpen: true, 
            removeId: id 
        });
    }

    handleRemoveUser = () => {
        this.setState({ loading: true });
        Utils.removeUser(this.state.removeId)
            .then((response) => {
                this.setState({ loading: false });
                this.showMessageError('Usuario eliminado');
                this.handleClose();
                this.getUsers(1);
            }).catch((error) => {
                this.setState({ loading: false });
                this.handleRequestError(error);
            });
    }

    handleClose = () => {
        this.setState({ removeOpen: false });
    }

    handleCreateUserDialog = () => {
        this.setState({ createUserDialog: true });
    }

    handleUpdateLoad = (file) => {
        if (!file)
            return;
        if (!file.name.match(/.(txt)$/i)) {
            this.showMessageError("El archivo a subir debe ser .txt");
            return;
        } else {
            this.setState({ loading: true });
            let formData = new FormData();
            formData.append('file', file);
            Utils.updateUsersLoad(formData)
                .then((response) => {
                    this.setState({ loading: false });
                    this.showMessageError('Actualización realizada.');
                }).catch((error) => {
                    this.setState({ loading: false });
                    this.handleRequestError(error);
                });
        }
    }

    callbackUserCreated = () => {
        this.createUserKey++;
        this.setState({ createUserDialog: false });
        this.getUsers(1);
    }

    render() {
        const actions = [
            <Button color="primary" key="no"
                onClick={this.handleClose}>No</Button>,
            <Button color="primary" key="si"
                variant="contained"
                onClick={this.handleRemoveUser}>Si</Button>,
        ];
        return (
            <div>
                <ContainerComponent showHeader={true}
                    loadingMask={this.state.loading}
                    renderTwoColGrid={true}
                    leftWidth={6}
                    left={
                        <Button variant="contained"
                            color="secondary"
                            style={{ marginTop: '30px', width: '100%' }}
                            onClick={this.handleCreateUserDialog}
                            disabled={!Utils.isAdmin()}
                        >
                            Crear Usuario
                        </Button>
                    }
                    rightWidth={6}
                    right={
                        <div>
                            <input type="file"
                                accept=".txt"
                                disabled={!Utils.isAuthorizedEdit()}
                                onChange={e => this.handleUpdateLoad(e.target.files[0])}
                                style={{ display: 'none' }}
                                id="upload-file"
                            />
                            <label htmlFor="upload-file">
                                <Button color="primary"
                                    variant="contained"
                                    style={{ marginTop: '30px', width: '100%' }}
                                    disabled={!Utils.isAuthorizedEdit()}
                                    component="span"
                                >
                                    Cargar información

                                </Button>
                            </label>
                        </div>
                    }
                    renderOneFullColGrid={true}
                    middle={
                        <Paper className="TableLoan" elevation={20}>
                            <div style={{ overflowX: 'auto' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                colSpan='5'
                                                style={{ textAlign: 'center' }}
                                            >
                                                Lista de usuarios
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Nombre</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Rol</TableCell>
                                            <TableCell>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.users.map((user, i) => {
                                            return (
                                                <TableRow key={i}>
                                                    <TableCell>{user.id}</TableCell>
                                                    <TableCell>{user.full_name}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>{user.role_display}</TableCell>
                                                    <TableCell>
                                                        <ButtonsActions
                                                            id={user.id}
                                                            onEdit={this.handleEditUser}
                                                            onRemove={this.handleDialogRemoveUser}
                                                        />
                                                    </TableCell>
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
                                onChangePage={(_, page) => this.getUsers(page + 1)}
                            />
                        </Paper>
                    }
                />
                <Snackbar open={this.state.openMessage}
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                    onClose={(_) => this.setState({ openMessage: false })}
                />
                <Dialog aria-labelledby="confirmation-dialog-title"
                    open={this.state.removeOpen}
                >
                    <DialogTitle id="confirmation-dialog-title">Confirmación</DialogTitle>
                    <DialogContent>
                        ¿Seguro que desea eliminar este usuario?
                    </DialogContent>
                    <DialogActions>{actions}</DialogActions>
                </Dialog>
                <CreateUserDialog key={this.createUserKey}
                    onUserCreated={this.callbackUserCreated}
                    creationOpen={this.state.createUserDialog}
                    onClose={() => {
                        this.createUserKey++;
                        this.setState({ createUserDialog: false })
                    }}
                />
            </div>
        );
    }
}

export default UsersListPage;