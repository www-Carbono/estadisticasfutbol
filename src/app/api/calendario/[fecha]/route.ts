import { DatabaseLoad } from '@/app/utils/DatabaseLoad'
export const GET = async (req: Request, { params }: { params: { fecha: string } }) => {
  // TeamId
  const { fecha } = params

  const client = DatabaseLoad()
  try {
    await client.connect()
    const data = await client.db('EstadisticasFutbol').collection('Calendar').findOne({ DateElement: fecha })
    return Response.json({ response: data })
  } catch (error) {
    console.log(error)
  } finally {
    client.close()
  }

  return Response.json({ response: 'Algun Error' })
}
