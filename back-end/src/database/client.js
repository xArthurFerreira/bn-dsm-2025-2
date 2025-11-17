import { PrismaClient } from "@prisma/client";

// Cria o cliente Prisma
const prisma = new PrismaClient()

// Tenta conectar o cliente Prisma e loga sucesso/falha para facilitar diagnóstico
prisma
  .$connect()
  .then(() => console.log('Prisma: conexão com o banco estabelecida.'))
  .catch(err => console.error('Prisma: erro ao conectar ao banco:', err))

export default prisma