const { User } = require("../src/models");

const users = [
  { name: "Ana Martins", email: "ana.martins@example.com" },
  { name: "Carlos Souza", email: "carlos.souza@example.com" },
  { name: "Fernanda Lima", email: "fernanda.lima@example.com" },
  { name: "João Pereira", email: "joao.pereira@example.com" },
  { name: "Mariana Rocha", email: "mariana.rocha@example.com" },
  { name: "Lucas Alves", email: "lucas.alves@example.com" },
  { name: "Juliana Costa", email: "juliana.costa@example.com" },
  { name: "Pedro Henrique", email: "pedro.henrique@example.com" },
  { name: "Camila Oliveira", email: "camila.oliveira@example.com" },
  { name: "Rafael Mendes", email: "rafael.mendes@example.com" },
  { name: "Larissa Dias", email: "larissa.dias@example.com" },
  { name: "Thiago Ramos", email: "thiago.ramos@example.com" },
  { name: "Bruna Ferreira", email: "bruna.ferreira@example.com" },
  { name: "Diego Barbosa", email: "diego.barbosa@example.com" },
  { name: "Isabela Nunes", email: "isabela.nunes@example.com" },
  { name: "Gabriel Cardoso", email: "gabriel.cardoso@example.com" },
  { name: "Renata Silva", email: "renata.silva@example.com" },
  { name: "Felipe Teixeira", email: "felipe.teixeira@example.com" },
  { name: "Paula Castro", email: "paula.castro@example.com" },
  { name: "André Lima", email: "andre.lima@example.com" },
];

async function seedUsers() {
  try {
    await User.bulkCreate(users, { ignoreDuplicates: true });
    console.log("20 usuários inseridos com sucesso.");
    process.exit(0);
  } catch (error) {
    console.error("Erro ao inserir usuários:", error);
    process.exit(1);
  }
}

seedUsers();
