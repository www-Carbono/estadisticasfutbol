import { MongoClient, ServerApiVersion } from 'mongodb'
export const POST = async () => {
  const Calendar = await GetCalendar()
  return Calendar
}

export const GetCalendar = async () => {
  const client = new MongoClient(process.env.DB_URL ?? '', {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  })
  try {
    await client.connect()
    const result = await client.db('EstadisticasFutbol').collection('Calendar').find().toArray()
    return Response.json({ response: result })
  } catch {
    console.log('error')
  } finally {
    client.close()
  }

  return Response.json({ response: 'Algun Error' })
}
