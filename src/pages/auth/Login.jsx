import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import clienteAxios from "../../config/axios";
import { ToastContainer } from "react-toastify";
import { msgError, msgInfo} from "../../components/Alertas";
import TextField from "@mui/material/TextField";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([email, password].includes("")) {
      msgInfo("Campos Obligatorios");
      return;
    }

    try {
      const url = `/login`;
      const { data } = await clienteAxios.post(url, { email, password });
      localStorage.setItem("token_adam", data.token);
      setAuth(data);
      navigate("/admin");
    } catch (error) {
      msgError(error.response.data.msg);
    }
  };

  return (
    <div className="flex items-center justify-center bg-red-950 h-screen" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/fondoLogin.jpg')",backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="items-center  md:mt-0  ">
        {/* Lado izquierdo con la imagen */}
        <div className=" mx-5 md:mx-auto">
          <img className="object-cover w-full" src="../../../public/logo.png" />
        </div>

        <ToastContainer />
        {/* Lado derecho con el formulario */}
        <div className="  mt-2 mx-5 md:mx-auto flex items-center justify-center">
          <div className="md:w-8/12 w-full">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium  text-red-200"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="username"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-red-200"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                  placeholder="Contraseña"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-900 text-white font-semibold rounded-lg py-2 hover:bg-red-600 transition duration-300 hover:animate-pulse "
              >
                Iniciar sesión
              </button>

              <Link
                className="block text-end my-2 text-red-300 text-sm hover:text-red-600 duration-200"
                to="/olvide-password"
              >
                Olvide mi contraseña
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
