const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/models');

jest.mock('../src/models');

describe('UserController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should return 422 if name or email is missing', async () => {
      const response = await request(app)
        .post('/users')
        .send({ name: '', email: '' });

      expect(response.status).toBe(422);
      expect(response.body.message).toBe('Nome e email são obrigatórios.');
    });

    it('should return 422 if email is invalid', async () => {
      const response = await request(app)
        .post('/users')
        .send({ name: 'Test User', email: 'invalidemail' });

      expect(response.status).toBe(422);
      expect(response.body.message).toBe('Email inválido.');
    });

    it('should return 409 if user already exists', async () => {
      User.findOne.mockResolvedValueOnce({ id: 1, name: 'Test User', email: 'test@user.com' });

      const response = await request(app)
        .post('/users')
        .send({ name: 'Test User', email: 'test@user.com' });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Usuário já cadastrado com esse email.');
    });

    it('should create a new user', async () => {
      User.findOne.mockResolvedValueOnce(null);
      User.create.mockResolvedValueOnce({ id: 1, name: 'Test User', email: 'test@user.com' });

      const response = await request(app)
        .post('/users')
        .send({ name: 'Test User', email: 'test@user.com' });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Test User');
      expect(response.body.email).toBe('test@user.com');
    });
  });

  describe('listUsers', () => {
    it('should return a list of users', async () => {
      User.findAll.mockResolvedValueOnce([{ id: 1, name: 'Test User', email: 'test@user.com' }]);

      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Test User');
    });

    it('should return 500 if there is an error fetching users', async () => {
      User.findAll.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).get('/users');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Erro ao buscar usuários.');
    });
  });

  describe('getUserById', () => {
    it('should return 400 if ID is invalid', async () => {
      const response = await request(app).get('/users/invalid');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('ID inválido.');
    });

    it('should return 404 if user is not found', async () => {
      User.findByPk.mockResolvedValueOnce(null);

      const response = await request(app).get('/users/1');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Usuário não encontrado.');
    });

    it('should return the user if found', async () => {
      User.findByPk.mockResolvedValueOnce({ id: 1, name: 'Test User', email: 'test@user.com' });

      const response = await request(app).get('/users/1');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Test User');
    });
  });

  describe('modifyUser', () => {
    it('should return 400 if ID is invalid', async () => {
      const response = await request(app)
        .put('/users/invalid')
        .send({ name: 'Updated User', email: 'updated@user.com' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('ID inválido.');
    });

    it('should return 422 if neither name nor email is provided', async () => {
      const response = await request(app)
        .put('/users/1')
        .send({ name: '', email: '' });

      expect(response.status).toBe(422);
      expect(response.body.message).toBe('Informe pelo menos nome ou email para atualização.');
    });

    it('should return 422 if email is invalid', async () => {
      const response = await request(app)
        .put('/users/1')
        .send({ name: 'Updated User', email: 'invalidemail' });

      expect(response.status).toBe(422);
      expect(response.body.message).toBe('Email inválido.');
    });

    it('should update the user', async () => {
      User.update.mockResolvedValueOnce([1]);

      const response = await request(app)
        .put('/users/1')
        .send({ name: 'Updated User', email: 'updated@user.com' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Usuário atualizado com sucesso.');
    });

    it('should return 404 if user is not found', async () => {
      User.update.mockResolvedValueOnce([0]);

      const response = await request(app)
        .put('/users/1')
        .send({ name: 'Updated User', email: 'updated@user.com' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Usuário não encontrado para atualização.');
    });
  });

  describe('removeUser', () => {
    it('should return 400 if ID is invalid', async () => {
      const response = await request(app).delete('/users/invalid');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('ID inválido.');
    });

    it('should return 404 if user is not found', async () => {
      User.destroy.mockResolvedValueOnce(0);

      const response = await request(app).delete('/users/1');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Usuário não encontrado para exclusão.');
    });

    it('should delete the user', async () => {
      User.destroy.mockResolvedValueOnce(1);

      const response = await request(app).delete('/users/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Usuário removido com sucesso.');
    });
  });
});
