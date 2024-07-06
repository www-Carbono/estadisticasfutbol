// Obtener una Lista de Todos los Equipos
import { DatabaseLoad } from '@/app/utils/DatabaseLoad'
export const GET = async () => {
  const client = DatabaseLoad()
  try {
    await client.connect()
    const equipos = await client.db('EstadisticasFutbol').collection('Teams').find().toArray()
    return Response.json({ Equipos: equipos })
  } catch {
    console.log('Error Obteniendo una Lista de todos los equipos. /api/equipos/route.js')
  } finally {
    client.close()
  }

  return Response.json({ response: 'Error Obteniendo una Lista de todos los equipos. /api/equipos/route.js' })
}

export const POST = async (req: Response) => {
  // TeamName , TeamId , TeamImage
  const body = await req.json()
  const { data } = body
  const client = DatabaseLoad()
  try {
    await client.connect()
    await client.db('EstadisticasFutbol').collection('Teams').insertOne(data)
    return Response.json({ response: 'Equipo Añadido Correctamente' })
  } catch (error) {
    console.log(error)
  } finally {
    client.close()
  }

  return Response.json({ response: 'Algun Error' })
}
