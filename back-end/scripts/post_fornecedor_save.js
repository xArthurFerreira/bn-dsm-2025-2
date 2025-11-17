import fs from 'fs';

async function main() {
  try {
    const body = fs.readFileSync('./scripts/fornecedor_request.json', 'utf8');
    const res = await fetch('http://localhost:8080/fornecedores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    const status = res.status;
    const text = await res.text();
    fs.writeFileSync('./scripts/create_fornecedor_response.json', text, 'utf8');
    console.log('STATUS:', status);
    console.log('Saved to scripts/create_fornecedor_response.json');
  } catch (err) {
    console.error('ERROR:', err.message || err);
    process.exit(1);
  }
}

main();
