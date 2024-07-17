import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import clienteAxios from "../../../config/axios";

const GestionContactos = () => {
  const [contactos, setContactos] = useState([]);

  useEffect(() => {
    //cargarContactos();
  }, []);



  const handleWhatsApp = (telefono) => {
    const message = "Hola, te contacto desde la app!";
    const url = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleEmail = (email) => {
    const subject = "Notificación Importante";
    const body = "Hola, te contacto desde la app!";
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank');
  };

  return (
    <List dense>
      {contactos.map((contacto) => (
        <ListItem key={contacto.id}>
          <ListItemText
            primary={contacto.nom_contacto}
            secondary={`Teléfono: ${contacto.fono}, Correo: ${contacto.mail}`}
          />
          <ListItemSecondaryAction>
            <Tooltip title="Enviar WhatsApp">
              <IconButton onClick={() => handleWhatsApp(contacto.fono)}>
                <WhatsAppIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Enviar Correo">
              <IconButton onClick={() => handleEmail(contacto.mail)}>
                <EmailIcon />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default GestionContactos;
