import { DatabaseLoad } from '@/app/utils/DatabaseLoad'
export const GET = async () => {
  const client = DatabaseLoad()
  try {
    await client.connect()
    const Calendar = await client.db('EstadisticasFutbol').collection('Calendar').find({}).toArray()
    return Response.json({ response: Calendar })
  } catch {
    console.log('Error Obteniendo el Calendario. /api/calendario/routeeeee.js')
  } finally {
    client.close()
  }

  return Response.json({ response: 'Error Obteniendo el calendario /api/calendario/routeeeee.js' })
}

export const POST = async (req: Response) => {
  const body = await req.json()
  const { remove, dataToSave } = body
  const client = DatabaseLoad()
  try {
    await client.connect()
    if (remove) {
      await client.db('EstadisticasFutbol').collection('Calendar').deleteMany({})
    }

    await client.db('EstadisticasFutbol').collection('Calendar').insertMany(dataToSave)
  } catch (error) {
    console.log('error')
  } finally {
    client.close()
  }

  return Response.json({ response: 'Algun Error' })
}
