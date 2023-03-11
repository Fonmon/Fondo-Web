import axiosLib from 'axios';
import {HOST_APP} from './Constants';

export const TOKEN_KEY = "TOKEN_FONDO_KEY";
export const ID_KEY = "USER_ID";
export const ROLE_KEY = "USER_ROLE";
export const NOTIFICATIONS_KEY = "NOTIFICATIONS_FONMON";

const axios = axiosLib.create({
    baseURL: HOST_APP,
    headers: {
        'Authorization':`Token ${localStorage.getItem(TOKEN_KEY)}`
    }
});

class Utils{
    static isAuthenticated(){
        let token = localStorage.getItem(TOKEN_KEY);
        return token ? true : false;
    }

    static redirectTo(path){
        window.location = path;
        return null;
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

    static hasNotificationsEnabled() {
        return localStorage.getItem(NOTIFICATIONS_KEY) === 'true';
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
        let month = `0${(date.getMonth() + 1)}`
        let day = `0${date.getDate()}`
        return date.getFullYear() + "-" + month.slice(-2) + "-" + day.slice(-2);
    }

    static convertToDate(dateStr){
        const [year,month,day] = dateStr.split('-');
        return new Date(year, month - 1, day);
    }

    static urlB64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
      
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
      
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    static async pushManagerSubscribe() {
        const permission = await Notification.requestPermission();
        if(permission === 'denied') return;
        const registration = await navigator.serviceWorker.getRegistration();
        if(!registration || !registration.pushManager) return;
        const currentSubscription = await registration.pushManager.getSubscription();
        if (currentSubscription) {
            return this.subscribeNotifications(currentSubscription);
        }

        console.log('subscribing push manager');
        try {
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true, //Always display notifications
                applicationServerKey: this.urlB64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY)
            })
            await this.subscribeNotifications(subscription);
        } catch (err) {
            console.error("Registering subscription error: ", err);
        }
    }

    static async pushManagerUnsubscribe(callService = true) {
        const registration = await navigator.serviceWorker.getRegistration();
        if(!registration || !registration.pushManager) return;
        const currentSubscription = await registration.pushManager.getSubscription();
        if (!currentSubscription) return;

        console.log('unsubscribing push manager');
        try {
            if(callService) {
                await currentSubscription.unsubscribe()
                await this.unsubscribeNotifications(currentSubscription)
            } else {
                await currentSubscription.unsubscribe()
            }
        } catch (err) {
            console.error("Unregistering subscription error: ", err)
        }
    }

    ///////////////////////////////////////////////////////////////////////
    // CALLS TO API
    ///////////////////////////////////////////////////////////////////////

    // https://github.com/axios/axios
    static authenticate(username, password){
        return axiosLib.post(`${HOST_APP}api-token-auth/`, {
            username: username,
            password: password
        });
    }

    static getUsers(page){
        return axios.get(`api/user${page?`?page=${page}`:''}`);
    }

    static getLoans(page,all_loans,state,paginate = true){
        return axios.get(`api/loan?page=${page}&all_loans=${all_loans}&state=${state}&paginate=${paginate}`);
    }

    static removeUser(id){
        return axios.delete(`api/user/${id}`);
    }

    static createUser(obj){
        return axios.post(`api/user/`,obj);
    }

    static getUser(id){
        return axios.get(`api/user/${id}`);
    }

    static updateUser(id,obj){
        return axios.patch(`api/user/${id}`,obj);
    }

    static createLoan(obj){
        return axios.post(`api/loan/`,obj);
    }

    static updateLoan(id, state){
        return axios.patch(`api/loan/${id}`, {
            'state':state
        });
    }

    static getLoan(id){
        return axios.get(`api/loan/${id}`);
    }

    static activateAccount(id,obj){
        return axiosLib.post(`${HOST_APP}api/user/activate/${id}`, obj);
    }

    static updateUsersLoad(obj){
        return axios.patch(`api/user/`, obj);
    }

    static updateLoansLoad(obj){
        return axios.patch(`api/loan/`, obj);
    }

    static loanApps(id, app, body={}){
        return axios.post(`api/loan/${id}/${app}`, body);
    }

    static getActivityYears(){
        return axios.get(`api/activity/year`);
    }

    static getActivities(idYear){
        return axios.get(`api/activity/year/${idYear}`);
    }

    static getActivity(id){
        return axios.get(`api/activity/${id}`);
    }

    static deleteActivity(id){
        return axios.delete(`api/activity/${id}`);
    }

    static createActivityYear(){
        return axios.post(`api/activity/year`, {});
    }

    static updateActivity(id, type, data){
        return axios.patch(`api/activity/${id}?patch=${type}`, data);
    }

    static createActivity(idYear, activity){
        return axios.post(`api/activity/year/${idYear}`, activity);
    }

    static subscribeNotifications(subscription){
        return axios.post(`api/notification/subscribe`, subscription);
    }

    static unsubscribeNotifications(subscription){
        return axios.post(`api/notification/unsubscribe`, subscription);
    }

    static getFiles(type) {
        let query = type !== undefined ? `?type=${type}` : "";
        return axios.get(`api/file${query}`);
    }

    static saveFile(obj) {
        return axios.post(`api/file/`, obj);
    }

    static getFileUrl(id) {
        return axios.get(`api/file/${id}`);
    }

    static userApps(app, body={}){
        return axios.post(`api/user/${app}`, body);
    }

    static getCaps(page, all_caps, state, paginate = true){
        return axios.get(`api/saving-account?page=${page}&all_accounts=${all_caps}&state=${state}&paginate=${paginate}`);
    }

    static createCap(obj){
        return axios.post(`api/saving-account/`, obj);
    }

    static updateCap(obj) {
        return axios.put('api/saving-account', obj);
    }

    // Admin panel

    static adminTestEmail() {
        return axios.get(`api/admin/`)
    }
}

export default Utils;