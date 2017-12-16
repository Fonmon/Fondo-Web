import axios from 'axios';

export const TOKEN_KEY = "TOKEN_FONDO_KEY";
export const HOST_APP = "http://localhost:8000/";

class Utils{

    static isAuthenticated(){
        let token = localStorage.getItem(TOKEN_KEY);
        return token ? true : false;
    }

    // https://github.com/axios/axios
    static authenticate(username, password){
        return axios.post(`${HOST_APP}api-token-auth/`,{
            username:username,
            password:password
        });
    }
}

export default Utils;