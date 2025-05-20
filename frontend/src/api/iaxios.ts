import axios from "axios";

const baseURL = "http://127.0.0.1:8000/api";

const iaxios = axios.create({
    baseURL: baseURL,
});

export default iaxios;

export function setTokenToAxios(token: string) {
    iaxios.defaults.headers.common["Authorization"] = `Token ${token}`;
}
