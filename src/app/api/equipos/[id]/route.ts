// Obtener Información de un equipo en concreto
import { DatabaseLoad } from '@/app/utils/DatabaseLoad'
export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  const { id } = params
  const client = DatabaseLoad()
  try {
    await client.connect()
    const equipos = await client.db('EstadisticasFutbol').collection('Teams').findOne({ TeamId: id })
    return Response.json({ Equipos: equipos })
  } catch {
    console.log('Error Obteniendo El equipo deseado /api/equipos/[id]/route.js')
  } finally {
    client.close()
  }

  return Response.json({ response: 'Error Obteniendo el equipo deseado. /api/equipos/[id]/route.js' })
}

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  // TeamId
  const body = await req.json()
  const { dataToUpdate } = body
  const { id } = params
  const updateDocument = {
    $set: {
      ...dataToUpdate
    }
  }
  const client = DatabaseLoad()
  try {
    await client.connect()
    await client.db('EstadisticasFutbol').collection('Teams').updateOne({ TeamId: id }, updateDocument)
    return Response.json({ response: 'Equipo Modificado Correctamente' })
  } catch (error) {
    console.log(error)
  } finally {
    client.close()
  }

  return Response.json({ response: 'Algun Error' })
}

export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  const { id } = params

  const client = DatabaseLoad()
  try {
    await client.connect()
    await client.db('EstadisticasFutbol').collection('Teams').deleteOne({ TeamId: id })
    return Response.json({ response: 'Equipo Eliminado Correctamente' })
  } catch (error) {
    console.log('error')
  } finally {
    client.close()
  }
}
