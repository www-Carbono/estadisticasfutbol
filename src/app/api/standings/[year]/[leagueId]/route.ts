import { MatchInformation } from './../../../../../../types.d'
import { DatabaseLoad } from '@/app/utils/DatabaseLoad'
import { NextRequest } from 'next/server'
export const GET = async (req: NextRequest, { params }: { params: { leagueId: string; year: string } }) => {
  const { leagueId, year } = params
  const client = DatabaseLoad()
  try {
    await client.connect()
    const partidos = await client
      .db('EstadisticasFutbol')
      .collection('Matches')
      .find({ LeagueId: leagueId, Año: year })
      .toArray()
    const standings = GetStandings(partidos)
    return Response.json({ Partidos: partidos })
  } catch {
    console.log('Error Obteniendo una Lista de los Partidos de este equipo /api/partidos/route.js')
  } finally {
    client.close()
  }
}

const GetStandings = (Partidos: MatchInformation[]) => {
  const allMatches = Partidos
  const data = {}

  allMatches.forEach((match) => {
    if (!data[match.EquipoLocalId]) {
      data[match.EquipoLocalId as string] = [
        {
          puntos: 0
        }
      ]
    }

    // Encuentra el índice del equipo en el array (si existe)
    const equipoIndex = data[match.EquipoLocalId as string].findIndex((e) => e.equipo === match.EquipoLocal)

    if (equipoIndex === -1) {
      // Si no existe, añade el equipo con 3 puntos
      data[match.EquipoLocalId as string].push({
        puntos: 3
      })
    } else {
      // Si existe, suma 3 puntos a los puntos actuales
      data[match.EquipoLocalId as string].puntos += 3
    }
  })

  console.log(data)
}

// if (calendar) {
//     const Ligas: string[] = []
//     calendar.Partidos.map((elemento) => Ligas.push(elemento.LeagueId as string))

//     const groupedGames: { [key: string]: CalendarMatches[] } = {}
//     calendar.Partidos.forEach((match) => {
//       const leagueId: string | undefined = match?.LeagueId

//       if (!groupedGames[leagueId as string]) {
//         groupedGames[match.LeagueId as string] = []
//       }
//       groupedGames[match.LeagueId as string].push(match)
//     })
//     setMatches(Object.values(groupedGames))
//   }
