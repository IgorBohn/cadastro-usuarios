import React, { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
} from "../services/userService";
import {
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Box,
  Paper,
  Typography,
  Divider,
} from "@mui/material";

type User = {
  id?: string;
  name: string;
  email: string;
};

export const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formUser, setFormUser] = useState<User>({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);

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

  const handleDelete = async (id: string) => {
    await deleteUser(id);
    loadUsers();
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleEdit(user.id!)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(user.id!)}
                    >
                      Excluir
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};
