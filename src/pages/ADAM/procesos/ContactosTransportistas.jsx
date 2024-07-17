import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Autocomplete,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import clienteAxios from "../../../config/axios";
import { msgError, msgOk } from "../../../components/Alertas";

const initialContactState = {
  id: null,
  nom_contacto: "",
  fono: "",
  mail: ""
};

const TransportistasContactos = () => {
  const [transportistas, setTransportistas] = useState([]);
  const [selectedTransportista, setSelectedTransportista] = useState(null);
  const [contactos, setContactos] = useState([]);
  const [editContact, setEditContact] = useState({ ...initialContactState });
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    obtenerTransportistas();
  }, []);

  const obtenerTransportistas = async () => {
    const token = localStorage.getItem("token_adam");
    if (!token) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await clienteAxios.get("/general/obtenerTransportistas", config);
    setTransportistas(data);
  };

  const cargarContactos = async (id) => {
    if (!id) return;

    const token = localStorage.getItem("token_adam");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await clienteAxios.get(`/adam/contacto/${id}`, config);
    setContactos(data);
  };

  const handleTransportistaChange = (_, newValue) => {
    setSelectedTransportista(newValue);
    if (newValue) {
      cargarContactos(newValue.id);
    } else {
      setContactos([]);
    }
  };

  const handleOpenDialog = (contact = initialContactState) => {
    setEditContact({ ...initialContactState, ...contact });
    setEditMode(!!contact.id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditContact({ ...initialContactState });
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditContact(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitContact = async () => {
    if ([editContact.nom_contacto, editContact.fono, editContact.mail].includes("")) {
      msgError("Ingrese todos los campos");
      return;
    }

    const token = localStorage.getItem("token_adam");
    if (!token) {
      msgError("Token no valido");
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    let data;
    if (editMode) {
      data = await clienteAxios.put(`/adam/contactos/${editContact.id}`, editContact, config);
    } else {
      data = await clienteAxios.post("/adam/contactos", {
        ...editContact,
        id_transportista: selectedTransportista.id
      }, config);
    }

    msgOk(data.data.msg);
    cargarContactos(selectedTransportista.id);
    handleCloseDialog();
  };

  const handleOpenDeleteDialog = (id) => {
    setContactToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token_adam");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    await clienteAxios.delete(`/adam/contactos/${contactToDelete}`, config);
    msgOk("Contacto eliminado correctamente");
    cargarContactos(selectedTransportista.id);
    setDeleteDialogOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <div className="mx-auto bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-red-900 mb-4">Gestión de Contactos de Transportistas</h2>
      <Autocomplete
        id="combo-box-transportistas"
        options={transportistas}
        getOptionLabel={(option) => option.nombre + " " + option.ape_paterno + " " + option.ape_materno}
        style={{ marginBottom: 20 }}
        onChange={handleTransportistaChange}
        renderInput={(params) => <TextField {...params} label="Seleccionar Transportista" variant="outlined" />}
      />
      <List>
        {contactos.map(contacto => (
          <ListItem key={contacto.id} divider>
            <ListItemText primary={contacto.nom_contacto} secondary={`${contacto.fono}\ | ${contacto.mail}`} />
            <ListItemSecondaryAction>
              <IconButton size="small" onClick={() => handleOpenDialog(contacto)}><EditIcon /></IconButton>
              <IconButton size="small" onClick={() => handleOpenDeleteDialog(contacto.id)}><DeleteIcon /></IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Button startIcon={<AddIcon />} onClick={() => handleOpenDialog()} color="primary">
        Añadir Contacto
      </Button>

      {/* Dialog for Add/Edit Contact */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? "Editar Contacto" : "Añadir Contacto"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            type="text"
            fullWidth
            name="nom_contacto"
            value={editContact.nom_contacto}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Teléfono"
            type="text"
            fullWidth
            name="fono"
            value={editContact.fono}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Correo Electrónico"
            type="email"
            fullWidth
            name="mail"
            value={editContact.mail}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancelar</Button>
          <Button onClick={handleSubmitContact} color="primary">{editMode ? "Actualizar" : "Guardar"}</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Confirming Delete */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{"Confirmar Eliminación"}</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Está seguro de que desea eliminar este contacto? Esta acción no se puede deshacer.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TransportistasContactos;
