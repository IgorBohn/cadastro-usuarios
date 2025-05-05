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

export const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formUser, setFormUser] = useState<User>({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

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
    if (isEditing && formUser.id) {
      await updateUser(formUser.id, formUser);
    } else {
      await createUser(formUser);
    }
    resetForm();
    loadUsers();
  };

  const handleEdit = async (id: string) => {
    const res = await getUserById(id);
    setFormUser(res.data);
    setIsEditing(true);
  };

  const confirmDelete = (id: string) => {
    setUserIdToDelete(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (userIdToDelete) {
      await deleteUser(userIdToDelete);
      loadUsers();
      setUserIdToDelete(null);
      setOpenConfirm(false);
    }
  };

  const resetForm = () => {
    setFormUser({ name: "", email: "" });
    setIsEditing(false);
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
            <Button variant="contained" onClick={handleSubmit}>
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
        open={openConfirm}
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir este usuário? Essa ação não poderá ser desfeita."
        type="warning"
        confirmText="Excluir"
        cancelText="Cancelar"
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
      />
    </Container>
  );
};
