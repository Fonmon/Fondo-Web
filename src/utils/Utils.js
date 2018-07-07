import axios from 'axios';
import {HOST_APP} from './Constants';

export const TOKEN_KEY = "TOKEN_FONDO_KEY";
export const ID_KEY = "USER_ID";
export const ROLE_KEY = "USER_ROLE";

const requestOpt = {
    headers: {
        'Authorization':`Token ${localStorage.getItem(TOKEN_KEY)}`
    }
}
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

    static isAuthorizedEdit(){
        return this.isAdmin() || this.isTreasurer();
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
                newValue.unshift(',');
                j=0;
            }
            newValue.unshift(valueArray[i]);
        }
        return newValue;
    }

    static formatDateDisplay(date){
        const dateRet = new Date(this.formatDate(date));
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return dateRet.toLocaleDateString('es',options);
    }

    static formatDate(date){
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }

    static convertToDate(dateStr){
        const [year,month,day] = dateStr.split('-');
        return new Date(year, month - 1, day);
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
        return axios.get(`${HOST_APP}api/user?page=${page}`,requestOpt);
    }

    static getLoans(page,all_loans,state,paginate = true){
        return axios.get(`${HOST_APP}api/loan?page=${page}&all_loans=${all_loans}&state=${state}&paginate=${paginate}`,requestOpt);
    }

    static removeUser(id){
        return axios.delete(`${HOST_APP}api/user/${id}`,requestOpt);
    }

    static createUser(obj){
        return axios.post(`${HOST_APP}api/user/`,obj,requestOpt);
    }

    static getUser(id){
        return axios.get(`${HOST_APP}api/user/${id}`,requestOpt);
    }

    static updateUser(id,obj){
        return axios.patch(`${HOST_APP}api/user/${id}`,obj,requestOpt);
    }

    static createLoan(obj){
        return axios.post(`${HOST_APP}api/loan/`,obj,requestOpt);
    }

    static updateLoan(id,state){
        return axios.patch(`${HOST_APP}api/loan/${id}`,{
                'state':state
            },requestOpt);
    }

    static getLoan(id){
        return axios.get(`${HOST_APP}api/loan/${id}`,requestOpt);
    }

    static logout(){
        return axios.post(`${HOST_APP}api/user/logout/`,{},requestOpt);
    }

    static activateAccount(id,obj){
        return axios.post(`${HOST_APP}api/user/activate/${id}`,obj);
    }

    static updateUsersLoad(obj){
        return axios.patch(`${HOST_APP}api/user/`,obj,requestOpt);
    }

    static updateLoansLoad(obj){
        return axios.patch(`${HOST_APP}api/loan/`,obj,requestOpt);
    }

    static loanApps(id, app, body){
        return axios.post(`${HOST_APP}api/loan/${id}/${app}`, body, requestOpt);
    }

    static getActivityYears(){
        return axios.get(`${HOST_APP}api/activity/year`,requestOpt);
    }

    static getActivities(idYear){
        return axios.get(`${HOST_APP}api/activity/year/${idYear}`,requestOpt);
    }

    static getActivity(id){
        return axios.get(`${HOST_APP}api/activity/${id}`,requestOpt);
    }

    static deleteActivity(id){
        return axios.delete(`${HOST_APP}api/activity/${id}`,requestOpt);
    }

    static createActivityYear(){
        return axios.post(`${HOST_APP}api/activity/year`,{},requestOpt);
    }

    static updateActivity(id, type, data){
        return axios.patch(`${HOST_APP}api/activity/${id}?patch=${type}`,data,requestOpt);
    }

    static createActivity(idYear, activity){
        return axios.post(`${HOST_APP}api/activity/year/${idYear}`,activity,requestOpt);
    }
}

export default Utils;