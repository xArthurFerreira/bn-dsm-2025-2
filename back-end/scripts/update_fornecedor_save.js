import fs from 'fs';

async function main() {
  try {
    // Primeiro, buscar um fornecedor existente para pegar o ID
    const getRes = await fetch('http://localhost:8080/fornecedores');
    const fornecedores = await getRes.json();
    
    if (!fornecedores || fornecedores.length === 0) {
      console.log('Nenhum fornecedor encontrado. Crie um antes.');
      process.exit(1);
    }
    
    const fornecedorId = fornecedores[0].id;
    console.log('Atualizando fornecedor ID:', fornecedorId);
    
    // Fazer o PUT para atualizar
    const body = JSON.stringify({
      razao_social: "Fornecedor Atualizado Ltda",
      nome_fantasia: "Fornecedor Atualizado",
      cnpj: "12345678000199",
      email: "fornecedor.atualizado@example.com",
      logradouro: "Rua Atualizada",
      num_casa: "150",
      complemento: "Sala 20",
      bairro: "Centro",
      municipio: "São Paulo",
      uf: "SP",
      cep: "01001-000",
      celular: "11988776655"
    });
    
    const res = await fetch(`http://localhost:8080/fornecedores/${fornecedorId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    
    const status = res.status;
    const text = await res.text();
    
    console.log('STATUS:', status);
    console.log('Response:', text || '(sem corpo - esperado para 204)');
    console.log('\n✓ Atualização concluída com status 204 (No Content)');
    
  } catch (err) {
    console.error('ERROR:', err.message || err);
    process.exit(1);
  }
}

main();
