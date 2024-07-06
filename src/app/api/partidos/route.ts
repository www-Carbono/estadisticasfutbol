import { DatabaseLoad } from '@/app/utils/DatabaseLoad'
import { NextRequest } from 'next/server'
export const POST = async (req: NextRequest) => {
  const { LocalId, AwayId, Year, LeagueId } = await req.json()
  console.log(Year)

  const client = DatabaseLoad()
  try {
    await client.connect()
    const partidos = await client
      .db('EstadisticasFutbol')
      .collection('Matches')
      .find({ EquipoLocalId: LocalId, Año: Year, EquipoVisitanteId: AwayId })
      .toArray()
    return Response.json({ Partidos: partidos })
  } catch {
    console.log('Error Obteniendo una Lista de los Partidos de este equipo /api/partidos/route.js')
  } finally {
    client.close()
  }

  return Response.json({ response: 'Error Obteniendo una Lista de partidos. /api/partidos/route.js' })
}
