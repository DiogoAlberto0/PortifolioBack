import { db } from "../src/config/prisma"
import { generateHash } from "../src/crypto"

const main = async () => {

  const hash = generateHash('12345')
    await db.user.create({
        data: {
            name: 'Diogo Alberto Fontes Gomes de Oliveira',
            gitHubPage: 'https://github.com/DiogoAlberto0',
            login: 'Dafgo03',
            password: hash,
            admin: true
        }
    })
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })