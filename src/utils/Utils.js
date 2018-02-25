import axios from 'axios';
import {HOST_APP} from './Constants';

export const TOKEN_KEY = "TOKEN_FONDO_KEY";
export const ID_KEY = "USER_ID";
export const ROLE_KEY = "USER_ROLE";

class Utils{

    static isAuthenticated(){
        let token = localStorage.getItem(TOKEN_KEY);
        return token ? true : false;
    }

    static redirectTo(path){
        window.location = path;
    }

    static isTreasurer(){
        return localStorage.getItem(ROLE_KEY) === '2';
    }

    static isPresident(){
        return localStorage.getItem(ROLE_KEY) === '1';
    }

    static isAdmin(){
        return localStorage.getItem(ROLE_KEY) === '0';
    }

    static isAuthorized(){
        return this.isAdmin() || this.isPresident() || this.isTreasurer();
    }

    static currentId(){
        return localStorage.getItem(ID_KEY);
    }

    static clearStorage(){
        localStorage.clear();
        window.location = '/';
    }

    static parseNumberMoney(value){
        let valueArray = String(value).split('');
        let newValue = [];
        let j = 0;
        for(let i = valueArray.length-1;i>=0;i--,j++){
            if(j === 3){
                newValue.unshift('.');
                j=0;
            }
            newValue.unshift(valueArray[i]);
        }
        return newValue;
    }

    static formatDate(date){
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    }

    ///////////////////////////////////////////////////////////////////////
    // CALLS TO API
    ///////////////////////////////////////////////////////////////////////

    // https://github.com/axios/axios
    static authenticate(username, password){
        return axios.post(`${HOST_APP}api-token-auth/`,{
            username:username,
            password:password
        });
    }

    static getUsers(page){
        return axios.get(`${HOST_APP}api/user?page=${page}`,{
            headers: {
                'Authorization':`Token ${localStorage.getItem(TOKEN_KEY)}`
            }
        });
    }

    static getLoans(page,all_loans,state){
        return axios.get(`${HOST_APP}api/loan?page=${page}&all_loans=${all_loans}&state=${state}`,{
            headers: {
                'Authorization':`Token ${localStorage.getItem(TOKEN_KEY)}`
            }
        });
    }

    static removeUser(id){
        return axios.delete(`${HOST_APP}api/user/${id}`,{
            headers: {
                'Authorization':`Token ${localStorage.getItem(TOKEN_KEY)}`
            }
        });
    }

    static createUser(obj){
        return axios.post(`${HOST_APP}api/user/`,obj,{
            headers: {
                'Authorization':`Token ${localStorage.getItem(TOKEN_KEY)}`
            }
        })
    }

    static getUser(id){
        return axios.get(`${HOST_APP}api/user/${id}`,{
            headers: {
                'Authorization':`Token ${localStorage.getItem(TOKEN_KEY)}`
            }
        });
    }

    static updateUser(id,obj){
        return axios.patch(`${HOST_APP}api/user/${id}`,obj,{
            headers: {
                'Authorization':`Token ${localStorage.getItem(TOKEN_KEY)}`
            }
        });
    }

    static createLoan(obj){
        return axios.post(`${HOST_APP}api/loan/`,obj,{
            headers: {
                'Authorization':`Token ${localStorage.getItem(TOKEN_KEY)}`
            }
        });
    }

    static updateLoan(id,state){
        return axios.patch(`${HOST_APP}api/loan/${id}`,{
                'state':state
            },{
            headers: {
                'Authorization':`Token ${localStorage.getItem(TOKEN_KEY)}`
            }
        });
    }

    static getLoan(id){
        return axios.get(`${HOST_APP}api/loan/${id}`,{
            headers: {
                'Authorization':`Token ${localStorage.getItem(TOKEN_KEY)}`
            }
        });
    }

    static logout(){
        return axios.post(`${HOST_APP}api/logout/`,{},{
            headers: {
                'Authorization':`Token ${localStorage.getItem(TOKEN_KEY)}`
            }
        });
    }

    static activateAccount(id,obj){
        return axios.post(`${HOST_APP}api/user/activate/${id}`,obj);
    }

    static updateUsersLoad(obj){
        return axios.patch(`${HOST_APP}api/user/`,obj,{
            headers: {
                'Authorization':`Token ${localStorage.getItem(TOKEN_KEY)}`
            }
        });
    }

    static updateLoansLoad(obj){
        return axios.patch(`${HOST_APP}api/loan/`,obj,{
            headers: {
                'Authorization':`Token ${localStorage.getItem(TOKEN_KEY)}`
            }
        });
    }
}

export default Utils;