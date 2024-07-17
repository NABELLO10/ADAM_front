import * as React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MenuIcon from "@mui/icons-material/Menu";

import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import useAuth from "../../hooks/useAuth.jsx"

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TuneIcon from '@mui/icons-material/Tune';
import ApartmentTwoToneIcon from '@mui/icons-material/ApartmentTwoTone';
import LocalShippingTwoToneIcon from '@mui/icons-material/LocalShippingTwoTone';
import ContactPageTwoToneIcon from '@mui/icons-material/ContactPageTwoTone';
import ContactMailTwoToneIcon from '@mui/icons-material/ContactMailTwoTone';
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone';
import RvHookupTwoToneIcon from '@mui/icons-material/RvHookupTwoTone';
import GpsFixedTwoToneIcon from '@mui/icons-material/GpsFixedTwoTone';
import EditNotificationsTwoToneIcon from '@mui/icons-material/EditNotificationsTwoTone';
import BadgeTwoToneIcon from '@mui/icons-material/BadgeTwoTone';
import AccountBalanceTwoToneIcon from '@mui/icons-material/AccountBalanceTwoTone';
import TuneTwoToneIcon from '@mui/icons-material/TuneTwoTone';
import ContactEmergencyTwoToneIcon from '@mui/icons-material/ContactEmergencyTwoTone';
import BallotTwoToneIcon from '@mui/icons-material/BallotTwoTone';

type Anchor = "left";

const menuGlobal = [
  
  { name: "Wialon Token", href: "/admin/wialon", icono: <GpsFixedTwoToneIcon /> },
  { name: "Empresas Gral.", href: "/admin/empresaGlobal", icono: <AccountBalanceTwoToneIcon /> },
/*   { name: "Turnos", href: "/admin/turnos", icono: <GpsFixedTwoToneIcon /> }, */
];

const menuConfig = [ 
  { name: "Perfiles", href: "/admin/perfil", icono: <TuneIcon /> },
  { name: "Usuarios", href: "/admin/usuarios", icono: <PeopleAltIcon /> }, 
/*   { name: "Empresas", href: "/admin/empresas", icono: <ApartmentTwoToneIcon /> }, */
];

const menuAlertas = [ 
  { name: "Tipo Alerta", href: "/admin/tipo-alerta", icono: <EditNotificationsTwoToneIcon /> },
  { name: "Alerta - Transportista", href: "/admin/alertaTransportista", icono: <ContactEmergencyTwoToneIcon /> },
/*   { name: "Empresas", href: "/admin/empresas", icono: <ApartmentTwoToneIcon /> }, */
];

const menuCamiones = [
/*   { name: "Transportistas", href: "/admin/transportistas", icono: <ContactPageTwoToneIcon /> }, */
  /* { name: "Conductores", href: "/admin/conductores", icono: <BadgeTwoToneIcon /> }, */
  { name: "Unidades", href: "/admin/camiones", icono: <LocalShippingTwoToneIcon /> },
/*   { name: "Arrastres", href: "/admin/arrastres", icono: <RvHookupTwoToneIcon /> },  */
];

const menuNotificaciones = [
/*   { name: "Cat. Notificacion", href: "/admin/cat-not", icono: <EditNotificationsTwoToneIcon /> }, */
  { name: "Ajustes", href: "/admin/tipo-notificacion", icono: <TuneTwoToneIcon /> },
/*   { name: "Conductor", href: "/admin/tablero-conductor", icono: <TuneTwoToneIcon /> }, */
/*   { name: "Notificaciones", href: "/admin/correos-notificacion", icono: <ContactMailTwoToneIcon /> }, */
];


const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function Sidebar() {
  const [state, setState] = React.useState({
    left: false,
  });

  const { auth } = useAuth();

  const [expanded, setExpanded] = React.useState<string | false>("");

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const handleSidebarClose = (event: React.MouseEvent) => {
    const isAccordionButton =
      event.currentTarget.tagName === "BUTTON" &&
      event.currentTarget.getAttribute("aria-controls") === "panel1d-header";
    event.currentTarget.getAttribute("aria-controls") === "config-header";
    event.currentTarget.getAttribute("aria-controls") === "transporte-header";
    event.currentTarget.getAttribute("aria-controls") === "notificaciones-header";
    if (!isAccordionButton) {
      toggleDrawer("left", false)(event);
    }
  };

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        marginTop: 2,
        width: 250,
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, true)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
     {/*  {menuGlobal.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>{item.icono}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        </Link>
      ))} */}

      <Accordion
        expanded={expanded === "config"}
        onChange={handleChange("config")}
      >
        <AccordionSummary
          aria-controls="config-content"
          id="config-header"
          onClick={(e) => e.stopPropagation()} // Avoid closing Sidebar when clicking the Accordion
        >
          <Typography> Configuración General</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {menuConfig.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>{item.icono}</ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>


      <Accordion
        expanded={expanded === "transporte"}
        onChange={handleChange("transporte")}
      >
        <AccordionSummary
          aria-controls="transporte-content"
          id="transporte-header"
          onClick={(e) => e.stopPropagation()} // Avoid closing Sidebar when clicking the Accordion
        >
          <Typography> Transporte</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {menuCamiones.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>{item.icono}</ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "alertas"}
        onChange={handleChange("alertas")}
      >
        <AccordionSummary
          aria-controls="alertas-content"
          id="alertas-header"
          onClick={(e) => e.stopPropagation()} // Avoid closing Sidebar when clicking the Accordion
        >
          <Typography> Alertas</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {menuAlertas.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>{item.icono}</ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

{/*       
      <Accordion
        expanded={expanded === "notificaciones"}
        onChange={handleChange("notificaciones")}
      >
        <AccordionSummary
          aria-controls="notificaciones-content"
          id="notificaciones-header"
          onClick={(e) => e.stopPropagation()} // Avoid closing Sidebar when clicking the Accordion
        >
          <Typography>Sensores</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {menuNotificaciones.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>{item.icono}</ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        </AccordionDetails>
      </Accordion> */}

      <Divider />
    </Box>
  );

  

  return (
    <div>
      <Tooltip title="DESPLEGAR MENU">
      <Button sx={{ color: "white" }} onClick={toggleDrawer("left", true)}>
        <MenuIcon />
      </Button>
      </Tooltip>

      <Drawer
        anchor="left"
        open={state.left}
        onClose={toggleDrawer("left", false)}
        onClick={handleSidebarClose}
      >
        {list("left")}
      </Drawer>
    </div>
  );
}
