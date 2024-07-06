import { DatabaseLoad } from '@/app/utils/DatabaseLoad'
export const GET = async () => {
  const client = DatabaseLoad()
  try {
    await client.connect()
    const Calendar = await client.db('EstadisticasFutbol').collection('Calendar').find({}).toArray()
    const CalendarFinal: (string | number)[][] = []
    Calendar.map((date) => {
      const dateString: string = date.DateElement
      const totalMatches: number = date.Partidos.length
      CalendarFinal.push([dateString, totalMatches])
    })
    return Response.json({ response: CalendarFinal })
  } catch {
    console.log('Error Obteniendo el Calendario. /api/calendario/route.js')
  } finally {
    client.close()
  }

  return Response.json({ response: 'Error Obteniendo el calendario /api/calendario/route.js' })
}
