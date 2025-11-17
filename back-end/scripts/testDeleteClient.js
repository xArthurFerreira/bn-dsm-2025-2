// Simple test to DELETE a client and show status
const fetch = global.fetch || (await import('node-fetch')).default;

async function main(){
  const id = '691a53a68e60f0d9188b3bc5' // Maria Silva id used earlier
  const res = await fetch(`http://localhost:8080/clientes/${id}`, { method: 'DELETE' })
  console.log('DELETE status:', res.status)
  const text = await res.text()
  console.log('Body:', text)
}

main().catch(e=>console.error('Error:', e))
