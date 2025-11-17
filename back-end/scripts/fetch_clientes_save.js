import fs from 'fs';

(async () => {
  try {
    const res = await fetch('http://localhost:8080/clientes?include=pedidos');
    const status = res.status;
    const text = await res.text();
    fs.writeFileSync('./scripts/get_clientes_response.json', text, 'utf8');
    console.log('STATUS:', status);
    console.log('Saved to scripts/get_clientes_response.json');
  } catch (err) {
    console.error('ERROR:', err.message || err);
    process.exit(1);
  }
})();
