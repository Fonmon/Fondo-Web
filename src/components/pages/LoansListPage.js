import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

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
                scope.handleRequestError(error);
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
                                    style={{marginTop:'30px',width:'100%'}}
                                    disabled={!Utils.isAuthorizedEdit()}
                                    component="span"
                                >
                                    Cargar información
                                    
                                </Button>
                            </label>
                            <LoanListComponent all={true} 
                                applicantColumn={true}/>
                        </div>
                    }
                />
                <Snackbar open={this.state.openMessage}
                    message={this.state.errorMessage}
                    autoHideDuration={4000}
                    onClose={(event) => this.setState({openMessage:false})}
                />
            </div>
        );
    }
}

export default LoansListPage;
