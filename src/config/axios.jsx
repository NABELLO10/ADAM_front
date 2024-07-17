import axios from "axios";

const clienteAxios = axios.create({
  baseURL : `${import.meta.env.VITE_BACKEND_URL}/api-adam` // sin proxy
//baseURL : `${import.meta.env.VITE_BACKEND_URL}` // con proxy
})

export default clienteAxios