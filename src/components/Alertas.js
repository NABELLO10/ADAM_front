import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const msgError = (msg) => {
    toast.error(msg, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
      
}

const msgOk = (msg) => {
    toast.success(msg, {
        position: "bottom-left",
        autoClose: 900,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });      
}

const msgInfo = (msg) => {
    toast.info(msg, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });      
}

const msgWarning = (msg) => {
    toast.warning(msg, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });      
}

export {
    msgError, msgOk, msgInfo, msgWarning
}