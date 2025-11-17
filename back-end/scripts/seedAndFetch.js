// Script to create 2 clients, 2 orders and fetch clients with orders
// Run with: node scripts/seedAndFetch.js

const base = 'http://localhost:8080'

async function req(path, opts) {
  const res = await fetch(base + path, opts)
  const text = await res.text()
  let body
  try { body = JSON.parse(text) } catch(e) { body = text }
  return { status: res.status, body }
}

async function main(){
  console.log('Creating client 1...')
  const client1 = await req('/clientes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
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
    })
  })
  console.log('Client1 status:', client1.status)
  console.log('Client1 body:', client1.body)

  console.log('Creating client 2...')
  const client2 = await req('/clientes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
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
    })
  })
  console.log('Client2 status:', client2.status)
  console.log('Client2 body:', client2.body)

  // If clients created and returned bodies contain id, use them; otherwise parse differently
  const id1 = client1.body?.id || client1.body?._id || null
  const id2 = client2.body?.id || client2.body?._id || null

  if(!id1 || !id2){
    console.error('Could not obtain client ids. Aborting.');
    return
  }

  console.log('Creating order for client1...')
  const order1 = await req('/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ num_pedido: 9001, cliente_id: id1 })
  })
  console.log('Order1 status:', order1.status)

  console.log('Creating order for client2...')
  const order2 = await req('/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ num_pedido: 9002, cliente_id: id2 })
  })
  console.log('Order2 status:', order2.status)

  console.log('Fetching clients with pedidos...')
  const list = await req('/clientes?include=pedidos', { method: 'GET' })
  console.log('GET /clientes?include=pedidos status:', list.status)
  console.log('Response body:')
  console.log(JSON.stringify(list.body, null, 2))
}

main().catch(e=>{ console.error('Script error', e) })
