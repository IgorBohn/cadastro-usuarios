import React, { useEffect, useState } from "react";
import { UserTable } from "../components/UserTable";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
} from "../services/userService";
import {
  Container,
  Button,
  TextField,
  Box,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import type { User } from "../types/user";
import { AlertDialog } from "../components/AlertDialog";

type AlertState = {
  open: boolean;
  title: string;
  description: string;
  type: "success" | "error" | "info" | "warning";
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
};

export const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formUser, setFormUser] = useState<User>({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);

  const [alert, setAlert] = useState<AlertState>({
    open: false,
    title: "",
    description: "",
    type: "info",
  });

  const loadUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormUser({ ...formUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && formUser.id) {
        await updateUser(formUser.id, formUser);
        setAlert({
          open: true,
          title: "Usuário Atualizado",
          description: "O usuário foi atualizado com sucesso.",
          type: "success",
          cancelText: "Ok",
        });
      } else {
        await createUser(formUser);
        setAlert({
          open: true,
          title: "Usuário Criado",
          description: "O usuário foi criado com sucesso.",
          type: "success",
          cancelText: "Ok",
        });
      }
      resetForm();
      loadUsers();
    } catch (error) {
      setAlert({
        open: true,
        title: "Erro",
        description: "Ocorreu um erro ao salvar o usuário.",
        type: "error",
      });
    }
  };

  const handleEdit = async (id: string) => {
    const res = await getUserById(id);
    setFormUser(res.data);
    setIsEditing(true);
  };

  const confirmDelete = (id: string) => {
    setAlert({
      open: true,
      title: "Confirmar Exclusão",
      description:
        "Tem certeza que deseja excluir este usuário? Essa ação não poderá ser desfeita.",
      type: "warning",
      confirmText: "Excluir",
      cancelText: "Cancelar",
      onConfirm: () => handleConfirmDelete(id),
    });
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      await deleteUser(id);
      loadUsers();
      setAlert({
        open: true,
        title: "Usuário Excluído",
        description: "O usuário foi excluído com sucesso.",
        type: "success",
        cancelText: "Ok",
      });
    } catch (error) {
      setAlert({
        open: true,
        title: "Erro",
        description: "Ocorreu um erro ao excluir o usuário.",
        type: "error",
      });
    }
  };
  const resetForm = () => {
    setFormUser({ name: "", email: "" });
    setIsEditing(false);
  };

  const handleAlertClose = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Usuários
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {isEditing ? "Editar Usuário" : "Cadastrar Novo Usuário"}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 400,
          }}
        >
          <TextField
            label="Nome"
            name="name"
            value={formUser.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={formUser.email}
            onChange={handleChange}
            fullWidth
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!formUser.name.trim() || !formUser.email.trim()}
            >
              {isEditing ? "Atualizar" : "Criar"}
            </Button>
            <Button variant="outlined" color="secondary" onClick={resetForm}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Lista de Usuários
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <UserTable users={users} onEdit={handleEdit} onDelete={confirmDelete} />
      </Paper>

      <AlertDialog
        open={alert.open}
        title={alert.title}
        description={alert.description}
        type={alert.type}
        confirmText={alert.confirmText}
        cancelText={alert.cancelText}
        onClose={handleAlertClose}
        onConfirm={
          alert.onConfirm
            ? () => {
                alert.onConfirm?.();
                handleAlertClose();
              }
            : undefined
        }
      />
    </Container>
  );
};
