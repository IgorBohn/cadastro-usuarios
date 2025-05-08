const { User } = require("../models");
const { Op } = require("sequelize");

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

class UserController {
  async createUser(req, res) {
    const { name, email } = req.body;

    if (!name?.trim() || !email?.trim()) {
      return res
        .status(422)
        .json({ message: "Nome e email são obrigatórios." });
    }

    if (!isValidEmail(email)) {
      return res.status(422).json({ message: "Email inválido." });
    }

    try {
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res
          .status(409)
          .json({ message: "Usuário já cadastrado com esse email." });
      }

      const newUser = await User.create({
        name: name.trim(),
        email: email.trim(),
      });
      return res.status(201).json(newUser);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Erro interno ao criar o usuário." });
    }
  }

  async listUsers(req, res) {
    const { search } = req.query;

    const whereConditions = {};

    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    try {
      const allUsers = await User.findAll({ where: whereConditions });
      return res.status(200).json(allUsers);
    } catch (err) {
      return res.status(500).json({ message: "Erro ao buscar usuários." });
    }
  }

  async getUserById(req, res) {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ message: "Erro ao buscar o usuário." });
    }
  }

  async modifyUser(req, res) {
    const userId = parseInt(req.params.id, 10);
    const { name, email } = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    if (!name?.trim() && !email?.trim()) {
      return res.status(422).json({
        message: "Informe pelo menos nome ou email para atualização.",
      });
    }

    if (email && !isValidEmail(email)) {
      return res.status(422).json({ message: "Email inválido." });
    }

    try {
      const updatedRows = await User.update(
        {
          ...(name && { name: name.trim() }),
          ...(email && { email: email.trim() }),
        },
        { where: { id: userId } }
      );

      if (updatedRows[0] === 0) {
        return res
          .status(404)
          .json({ message: "Usuário não encontrado para atualização." });
      }

      return res
        .status(200)
        .json({ message: "Usuário atualizado com sucesso." });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao atualizar o usuário." });
    }
  }

  async removeUser(req, res) {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "ID inválido." });
    }

    try {
      const deleted = await User.destroy({ where: { id: userId } });

      if (!deleted) {
        return res
          .status(404)
          .json({ message: "Usuário não encontrado para exclusão." });
      }

      return res.status(200).json({ message: "Usuário removido com sucesso." });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao excluir o usuário." });
    }
  }
}

module.exports = new UserController();
