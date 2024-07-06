import { MongoClient, ServerApiVersion } from 'mongodb'

export const DatabaseLoad = () => {
  const client = new MongoClient(process.env.DB_URL ?? '', {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  })
  return client
}
