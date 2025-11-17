import prisma from '../database/client.js'
import { includeRelations } from '../lib/utils.js'

const controller = {}   // Objeto vazio

controller.create = async function(req, res) {
  try {
    // Validar campos obrigatórios
    const { nome, cpf, email, logradouro, num_imovel, bairro, municipio, uf, cep, celular } = req.body
    
    if (!nome || !cpf || !email || !logradouro || !num_imovel || !bairro || !municipio || !uf || !cep || !celular) {
      return res.status(400).send({ error: 'Campos obrigatórios faltando' })
    }

    // Preparar dados
    const data = {
      nome,
      cpf,
      email,
      logradouro,
      num_imovel,
      complemento: req.body.complemento || null,
      bairro,
      municipio,
      uf,
      cep,
      celular
    }

    // Converter data se fornecida
    if (req.body.data_nascimento) {
      try {
        data.data_nascimento = new Date(req.body.data_nascimento)
      } catch (e) {
        // Se falhar, simplesmente não adiciona a data
      }
    }

    const cliente = await prisma.cliente.create({ data })

    res.status(201).send(cliente)
  }
  catch(error) {
    console.error('Erro ao criar cliente:', error.message)
    
    // Se for erro de campo único duplicado
    if (error.code === 'P2002') {
      return res.status(400).send({ error: `${error.meta?.target?.[0]} já existe` })
    }
    
    res.status(500).send({ error: error.message })
  }
}

controller.retrieveAll = async function(req, res) {
  try {

    const include = includeRelations(req.query)

    // Manda buscar todas as categorias cadastradas no BD
    const result = await prisma.cliente.findMany({
      include,
      orderBy: [ { nome: 'asc' }]  // Ordem ASCendente
    })

    // Retorna os dados obtidos ao cliente com o status
    // HTTP 200: OK (implícito)
    res.send(result)
  }
  catch(error) {
    // Algo deu errado: exibe o erro no terminal
    console.error(error)

    // Envia o erro ao front-end, com código de erro
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}

controller.retrieveOne = async function(req, res) {
  try {

    const include = includeRelations(req.query)

    // Manda recuperar o documento no servidor de BD
    // usando como critério um id informado no parâmetro
    // da requisição
    const result = await prisma.cliente.findUnique({
      include,
      where: { id: req.params.id }
    })

    // Encontrou o docuemento ~> retorna HTTP 200: OK (implícito)
    if(result) res.send(result)
    // Não encontrou o documento ~> retorna HTTP 404: Not Found
    else res.status(404).end()
  }
  catch(error) {
    // Algo deu errado: exibe o erro no terminal
    console.error(error)

    // Envia o erro ao front-end, com código de erro
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}

controller.update = async function(req, res) {
  try {
    // Busca o documento passado como parâmetro e, caso o documento seja
    // encontrado, atualiza-o com as informações contidas em req.body
    const clienteAtualizado = await prisma.cliente.update({
      where: { id: req.params.id },
      data: req.body
    })

    // Encontrou e atualizou ~> retorna HTTP 200 com os dados atualizados
    res.status(200).send(clienteAtualizado)
  }
  catch(error) {
    // Algo deu errado: exibe o erro no terminal
    console.error(error)

    // P2025: erro do Prisma referente a objeto não encontrado
    if(error?.code === 'P2025') {
      // Não encontrou e não atualizou ~> retorna HTTP 404: Not Found
      res.status(404).end()
    }
    else {    // Outros tipos de erro
      // Envia o erro ao front-end, com código de erro
      // HTTP 500: Internal Server Error
      res.status(500).send(error)
    }
  }
}

controller.delete = async function(req, res) {
  try {
    // Antes de excluir o cliente, remover pedidos associados
    // (prisma/mongo não faz cascade automaticamente aqui)
    await prisma.pedido.deleteMany({ where: { cliente_id: req.params.id } })

    // Em seguida exclui o cliente
    await prisma.cliente.delete({ where: { id: req.params.id } })

    // Encontrou e excluiu ~> HTTP 204: No Content
    res.status(204).end()
  }
  catch(error) {
    // Algo deu errado: exibe o erro no terminal
    console.error(error)

    // P2025: erro do Prisma referente a objeto não encontrado
    if(error?.code === 'P2025') {
      // Não encontrou e não excluiu ~> retorna HTTP 404: Not Found
      res.status(404).end()
    }
    else {    // Outros tipos de erro
      // Envia o erro ao front-end, com código de erro
      // HTTP 500: Internal Server Error
      res.status(500).send(error)
    }
  }
}

export default controller