import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import ContainerComponent from '../base/ContainerComponent';
import LoanListComponent from '../base/LoanListComponent';
import Utils from '../../utils/Utils';

class LoansListPage extends ContainerComponent {

    constructor(){
        super();
        this.state = {
            openMessage: false,
            errorMessage: '',
            loading:false
        }
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
            Utils.updateLoansLoad(formData)
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

    render() {
        return (
            <div>
                <ContainerComponent showHeader={true}
                    loadinMask={this.state.loading}
                    renderOneFullColGrid={true}
                    middle={
                        <div>
                            <RaisedButton label="Cargar información" 
                                primary={true} 
                                style={{marginTop:'30px',width:'100%'}}
                                disabled={!Utils.isAuthorized()}
                                containerElement='label'>
                                <input type="file" 
                                    onChange={e => this.handleUpdateLoad(e.target.files[0])}
                                    style={{ display: 'none' }} />
                            </RaisedButton>
                            <LoanListComponent all={true} 
                                applicantColumn={true}/>
                        </div>
                    }
                />
                <Snackbar
                    open={this.state.openMessage}
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                    onRequestClose={(event) => this.setState({openMessage:false})}
                />
            </div>
        );
    }
}

export default LoansListPage;
