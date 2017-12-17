import axios from 'axios';

export const TOKEN_KEY = "TOKEN_FONDO_KEY";
export const HOST_APP = "http://localhost:8000/";

class Utils{

    static isAuthenticated(){
        let token = localStorage.getItem(TOKEN_KEY);
        return token ? true : false;
    }

    static redirectTo(path){
        window.location = path;
    }

    static isTreasurer(){
        //something
        return false;
    }
    
    static isAdmin(){
        //something
        return true;
    }

    static logout(){
        localStorage.removeItem(TOKEN_KEY);
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
}

export default Utils;