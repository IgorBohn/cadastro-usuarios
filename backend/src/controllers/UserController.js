const { User } = require("../models");

class UserController {
  async createUser(req, res) {
    const { name, email } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Os campos nome e email são obrigatórios." });
    }

    try {
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Usuário já cadastrado com esse email." });
      }

      const newUser = await User.create({ name, email });

      return res.status(201).json(newUser);
    } catch (err) {
      return res.status(500).json({ message: "Erro ao criar o usuário." });
    }
  }

  async listUsers(req, res) {
    try {
      const allUsers = await User.findAll();
      return res.status(200).json(allUsers);
    } catch (err) {
      return res.status(500).json({ message: "Erro ao buscar usuários." });
    }
  }

  async getUserById(req, res) {
    const userId = req.params.id;

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
    const userId = req.params.id;
    const { name, email } = req.body;

    try {
      const updatedRows = await User.update(
        { name, email },
        { where: { id: userId } }
      );

      if (updatedRows[0] === 0) {
        return res
          .status(404)
          .json({ message: "Usuário não encontrado para atualização." });
      }

      return res
        .status(200)
        .json({ message: "Dados do usuário atualizados com sucesso." });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao atualizar o usuário." });
    }
  }

  async removeUser(req, res) {
    const userId = req.params.id;

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
