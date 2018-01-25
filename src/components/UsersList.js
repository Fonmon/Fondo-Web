import React, { Component } from 'react';
import Header from './Header';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import Utils from '../utils/Utils';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import ContentRemoveCircleOutline from 'material-ui/svg-icons/content/remove-circle-outline';
import ActionOpenInNew from 'material-ui/svg-icons/action/open-in-new';
import Divider from 'material-ui/Divider';
import Pagination from 'material-ui-pagination';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CreateUserDialog from './CreateUserDialog';
import LoadingMask from './LoadingMask';

const ButtonsActions = (props) => {
    if(Utils.isAdmin())
        return (
            <div>
                <IconButton onClick={props.onEdit.bind(this,props.id)}><ActionOpenInNew /></IconButton>
                <IconButton onClick={props.onRemove.bind(this,props.id)}><ContentRemoveCircleOutline /></IconButton>
            </div>
        );
    else
        return (
            <div>
                <IconButton onClick={props.onEdit.bind(this,props.id)}><ActionOpenInNew /></IconButton>
            </div>
        );
}

class UsersList extends Component{

    constructor(){
        super();
        this.state = {
            openMessage: false,
            errorMessage: '',
            users: [],
            removeOpen: false,
            removeId: -1,
            createUserDialog: false,
            currentPage: 1,
            totalPages: 1,
            loading:false
        }
    }

    componentDidMount = () => {
        this.getUsers(1);
    }

    getUsers(page){
        let scope = this;
        this.setState({currentPage:page});
        this.setState({loading:true});
        Utils.getUsers(page)
            .then(function(response){
                scope.setState({totalPages:response.data.num_pages});
                scope.setState({users:response.data.list});
                scope.setState({loading:false});
            }).catch(function(error){
                scope.setState({loading:false});
                if(!error.response){
                    scope.showMessageError('Error de conexión, inténtalo más tarde.');
                }else{
                    scope.showMessageError(error.message);
                }
            });
    }

    showMessageError(message){
        this.setState({openMessage: true,errorMessage:message});
    }

    handleRequestClose = () => {
        this.setState({
            openMessage: false
        });
    }

    handleEditUser = (id) => {
        Utils.redirectTo(`/user/${id}`);
    }
    
    handleDialogRemoveUser = (id) => {
        this.setState({removeOpen:true, removeId:id});
    }

    handleRemoveUser = () =>{
        let scope = this;
        this.setState({loading:true});
        Utils.removeUser(this.state.removeId)
            .then(function(response){
                scope.setState({loading:false});
                scope.showMessageError('Usuario eliminado');
                scope.handleClose();
                scope.getUsers(1);
            }).catch(function(error){
                scope.setState({loading:false});
                if(!error.response){
                    scope.showMessageError('Error de conexión, inténtalo más tarde.');
                }else if(error.response.status === 401){
                    Utils.clearStorage();
                }else{
                    scope.showMessageError(error.message);
                }
            });
    }

    handleClose = () => {
        this.setState({removeOpen: false});
    }

    handleCreateUserDialog = () =>{
        this.setState({createUserDialog: true});
    }

    handleUpdateLoad = (file) =>{
        let scope = this;
        if(!file)
            return;
        if(!file.name.match(/.(txt)$/i)){
            this.showMessageError("El archivo a subir debe ser .txt");
            return;
        }else{
            this.setState({loading:true});
            let formData = new FormData();
            formData.append('file',file);
            Utils.updateUsersLoad(formData)
                .then(function(response){
                    scope.setState({loading:false});
                    scope.showMessageError('Actualización realizada.');
                }).catch(function(error){
                    scope.setState({loading:false});
                    if(!error.response){
                        scope.showMessageError('Error de conexión, inténtalo más tarde.');
                    }else if(error.response.status === 401){
                        Utils.clearStorage();
                    }else{
                        scope.showMessageError(error.message);
                    }
                });
        }
    }

    callbackUserCreated = () => {
        this.setState({createUserDialog: false});
        this.getUsers(1);
    }
    
    render(){
        const actions = [
            <FlatButton
                label="No"
                primary={true}
                onClick={this.handleClose}
            />,
            <RaisedButton
                label="Si"
                primary={true}
                onClick={this.handleRemoveUser}
            />,
        ];
        return (
            <div>
                <Header />
                <LoadingMask active={this.state.loading} />
                <Grid fluid>
                    <Row>
                        <Col lg={6} md={6} xs={12} >
                            <RaisedButton label="Crear Usuario" 
                                secondary={true} 
                                style={{marginTop: '30px',width:'100%'}}
                                onClick={this.handleCreateUserDialog}
                                disabled={!Utils.isAdmin()} />
                        </Col>
                        <Col lg={6} md={6} xs={12} >
                            <RaisedButton label="Cargar información" 
                                primary={true} 
                                style={{marginTop:'30px',width:'100%'}}
                                disabled={!Utils.isAuthorized()}
                                containerElement='label'>
                                <input type="file" 
                                    onChange={e => this.handleUpdateLoad(e.target.files[0])}
                                    style={{ display: 'none' }} />
                            </RaisedButton>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} >
                            <Paper className="TableLoan" zDepth={5}>
                                <Table fixedHeader={false} 
                                    style={{ tableLayout: 'auto' }}
                                    bodyStyle= {{ overflowX: undefined, overflowY: undefined }}
                                    selectable={false}>
                                    <TableHeader
                                        adjustForCheckbox={false}
                                        displaySelectAll={false}
                                        >
                                        <TableRow>
                                            <TableHeaderColumn 
                                                colSpan="5"
                                                style={{textAlign: 'center'}}
                                                >
                                                Lista de usuarios
                                            </TableHeaderColumn>
                                        </TableRow>
                                        <TableRow>
                                            <TableHeaderColumn>ID</TableHeaderColumn>
                                            <TableHeaderColumn>Nombre</TableHeaderColumn>
                                            <TableHeaderColumn>Email</TableHeaderColumn>
                                            <TableHeaderColumn>Rol</TableHeaderColumn>
                                            <TableHeaderColumn>Acciones</TableHeaderColumn>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody
                                        displayRowCheckbox={false}
                                        >
                                        {this.state.users.map((user,i) => {
                                            return (<TableRow key={i}>
                                                <TableRowColumn>{user.id}</TableRowColumn>
                                                <TableRowColumn>{user.full_name}</TableRowColumn>
                                                <TableRowColumn>{user.email}</TableRowColumn>
                                                <TableRowColumn>{user.role}</TableRowColumn>
                                                <TableRowColumn >
                                                    <ButtonsActions 
                                                        id={user.id} 
                                                        onEdit={this.handleEditUser}
                                                        onRemove={this.handleDialogRemoveUser} />
                                                </TableRowColumn>
                                            </TableRow>);
                                        })}
                                    </TableBody>
                                </Table>
                                <Divider />
                                <center><Pagination
                                    total = { this.state.totalPages }
                                    current = { this.state.currentPage }
                                    display = { 10 }
                                    onChange = { number => this.getUsers(number) }
                                    />
                                </center>  
                            </Paper>
                        </Col>
                    </Row>
                </Grid>
                <Snackbar
                    open={this.state.openMessage}
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                    onRequestClose={this.handleRequestClose}
                    />
                <Dialog
                    title="Confirmación"
                    actions={actions}
                    modal={false}
                    onRequestClose={this.handleClose}
                    open={this.state.removeOpen}>
                    ¿Seguro que desea eliminar este usuario?
                </Dialog>
                <CreateUserDialog 
                    onUserCreated={this.callbackUserCreated}
                    creationOpen={this.state.createUserDialog} />
            </div>
        );
    }
}

export default UsersList;