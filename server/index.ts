import server from './server.ts'

const PORT = Number(process.env.PORT || 3000)

server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`)
})
