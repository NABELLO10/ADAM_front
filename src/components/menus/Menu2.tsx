import * as React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Sidebar from "./Sidebar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import useAuth from "../../hooks/useAuth";
import PhonelinkRingTwoToneIcon from '@mui/icons-material/PhonelinkRingTwoTone';
import ModeOfTravelTwoToneIcon from '@mui/icons-material/ModeOfTravelTwoTone';
import LocalShippingTwoToneIcon from '@mui/icons-material/LocalShippingTwoTone';
import ScreenshotMonitorTwoToneIcon from '@mui/icons-material/ScreenshotMonitorTwoTone';
import HeadsetMicTwoToneIcon from '@mui/icons-material/HeadsetMicTwoTone';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Camiones from "../../pages/mantenedores/Camiones";

const componentes = {
  "camiones": Camiones,
};

function Menu2() {
  const { auth, cerrarSesion } = useAuth();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const [dialogoAbierto, setDialogoAbierto] = React.useState(false);
  const [componenteActivo, setComponenteActivo] = React.useState("");


  const abrirDialogo = (componente) => {
    setComponenteActivo(componente);
    setDialogoAbierto(true);
  };

  const cerrarDialogo = () => {
    setDialogoAbierto(false);
    setComponenteActivo("");
  };

// Decide qué componente renderizar basado en el estado
  const ComponenteDialogo = componenteActivo ? componentes[componenteActivo] : null;
  

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const theme = useTheme();
  // Usa un media query para aplicar pantalla completa solo en dispositivos pequeños
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


  return (
    <AppBar
      position="fixed"
      sx={{ color: "#FFFFFF", backgroundColor: "#7c1810" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            ADAM
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "flex", alignItems: "center" },
            }}
          >
            <Sidebar />
 
             <div className="flex gap-2">
              <div className="hover:bg-red-950  bg-red-800 p-2  rounded-lg">
                <Tooltip title="Gestion Alertas">
                  <Link to="/admin/gestionAlerta">
                    <HeadsetMicTwoToneIcon />
                  </Link>
                </Tooltip>
              </div>
              <div className="hover:bg-red-950  bg-red-800 p-2  rounded-lg">
                <Tooltip title="Gestion HOWEN">
                  <Link to="/admin/gestionAlertaHowen">
                    <ScreenshotMonitorTwoToneIcon />
                  </Link>
                </Tooltip>
              </div>
        {/*       <div className="hover:bg-cyan-800  bg-cyan-900 p-2  rounded-lg">
                <Tooltip title="TABLERO TABLET">
                  <Link to="/admin/tablero-tablet">
                    <PhonelinkRingTwoToneIcon />
                  </Link>
                </Tooltip>
              </div>

               <div className="hover:bg-cyan-800  bg-cyan-900 p-2  rounded-lg">
                <Tooltip title="UNIDADES">
                  <Link to="/admin/camiones">
                    <LocalShippingTwoToneIcon />
                  </Link>
                </Tooltip>
              </div>  */}
    
            </div> 
          </Box>

          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 1,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontSize: 17,
            }}
          >
            {auth.nom_usuario}
          </Typography>

          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          ></Typography>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Modificar Perfil">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <AccountCircleIcon sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <Link
                to="/admin/actualizar-password"
                className="block px-4 font-bold py-2 text-sm text-blue-950 hover:bg-blue-200"
              >
                Cambiar Contraseña
              </Link>

              <Link
                className="block px-4 font-bold py-2 text-sm text-blue-950 hover:bg-blue-200"
                onClick={cerrarSesion}
                to="/"
              >
                Cerrar Sesion
              </Link>
            </Menu>
          </Box>
        </Toolbar>
      </Container>


      <Dialog
       fullScreen={fullScreen} // Mantén esta línea si aún deseas el modo de pantalla completa en dispositivos pequeños
       open={dialogoAbierto}
       onClose={cerrarDialogo}
       aria-labelledby="responsive-dialog-title"
       fullWidth={true} // Asegúrate de que el diálogo se expanda al ancho disponible
       maxWidth="xl"
      >
        <DialogContent>
          {ComponenteDialogo ? <ComponenteDialogo /> : "No hay componente seleccionado."}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={cerrarDialogo}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      
    </AppBar>
  );
}
export default Menu2;
