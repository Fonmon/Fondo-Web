import axios from 'axios';

export const TOKEN_KEY = "TOKEN_FONDO_KEY";
export const HOST_APP = "http://localhost:8000/";
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

    static logout(){
        localStorage.clear();
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

    static getUsers(){
        return axios.get(`${HOST_APP}api/user/`,{
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
}

export default Utils;