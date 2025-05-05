import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
} from "@mui/material";
import type { User } from "../types/user";

type UserTableProps = {
  users: User[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete,
}) => (
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
                onClick={() => onEdit(user.id!)}
              >
                Editar
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => onDelete(user.id!)}
              >
                Excluir
              </Button>
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
