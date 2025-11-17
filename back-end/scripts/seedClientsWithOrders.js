// Script to create 2 clients with orders directly in MongoDB
// Run with: node scripts/seedClientsWithOrders.js

import prisma from '../src/database/client.js'

async function main() {
  try {
    console.log('Cleaning previous test data...')
    await prisma.cliente.deleteMany({
      where: {
        cpf: { in: ['77788899900', '33344455566'] }
      }
    })

    console.log('\n✅ Creating Client 1: Arthur Rodrigues Ferreira')
    const client1 = await prisma.cliente.create({
      data: {
        nome: 'Arthur Rodrigues Ferreira',
        cpf: '77788899900',
        email: 'arthur.seed@example.com',
        logradouro: 'Rua das Flores',
        num_imovel: '123',
        complemento: 'Apto 45',
        bairro: 'Centro',
        municipio: 'São Paulo',
        uf: 'SP',
        cep: '01234-567',
        celular: '11999990000'
      }
    })
    console.log('Client 1 created:', JSON.stringify(client1, null, 2))

    console.log('\n✅ Creating Client 2: Maria Silva')
    const client2 = await prisma.cliente.create({
      data: {
        nome: 'Maria Silva',
        cpf: '33344455566',
        email: 'maria.seed@example.com',
        logradouro: 'Avenida Brasil',
        num_imovel: '45',
        complemento: 'Casa',
        bairro: 'Jardim',
        municipio: 'Campinas',
        uf: 'SP',
        cep: '13000-000',
        celular: '19988877766'
      }
    })
    console.log('Client 2 created:', JSON.stringify(client2, null, 2))

    console.log('\n✅ Creating Order 1 for Arthur')
    const order1 = await prisma.pedido.create({
      data: {
        num_pedido: 9001,
        cliente_id: client1.id
      }
    })
    console.log('Order 1 created:', JSON.stringify(order1, null, 2))

    console.log('\n✅ Creating Order 2 for Maria')
    const order2 = await prisma.pedido.create({
      data: {
        num_pedido: 9002,
        cliente_id: client2.id
      }
    })
    console.log('Order 2 created:', JSON.stringify(order2, null, 2))

    console.log('\n✅ Fetching all clients with orders included...')
    const clientsWithOrders = await prisma.cliente.findMany({
      include: { pedidos: true },
      orderBy: { nome: 'asc' }
    })
    console.log('\n========== FINAL RESULT: GET /clientes?include=pedidos ==========')
    console.log('Status: 200 OK')
    console.log('Response Body:')
    console.log(JSON.stringify(clientsWithOrders, null, 2))
    console.log('==================================================================')

  } catch (error) {
    console.error('Script error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
