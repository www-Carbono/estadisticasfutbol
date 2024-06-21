import * as cheerio from 'cheerio'
import { CalendarMatches, saveDatabase } from '../../../../../types'
import { MongoClient, ServerApiVersion } from 'mongodb'

// type Element = cheerio.Element
export const GET = async () => {
  const CalendarDataNext: saveDatabase[] = await GetCalendarData('#content > div.prevnext > a.button2.next')
  console.log(CalendarDataNext)
  await SaveData(CalendarDataNext, true)
  const CalendarDataPlayed: saveDatabase[] = await GetCalendarData('#content > div.prevnext > a.button2.prev')
  await SaveData(CalendarDataPlayed, false)

  return Response.json({ reponse: 'Calendario Actualizado Correctamente' })
}

const GetTodayDate = () => {
  const hoy = new Date()
  // Obtener el año, el mes y el día
  const año = hoy.getFullYear()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0') // Los meses en JavaScript son 0-indexados, así que sumamos 1
  const dia = String(hoy.getDate()).padStart(2, '0')

  // Formatear la fecha en el formato deseado
  const fechaFormateada = `${año}-${mes}-${dia}`
  return fechaFormateada
}

const SaveData = async (dataToSave: saveDatabase[], remove: boolean) => {
  const client = new MongoClient(process.env.DB_URL ?? '', {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  })
  await client.connect()
  if (remove) {
    await client.db('EstadisticasFutbol').collection('Calendar').deleteMany({})
  }

  await client.db('EstadisticasFutbol').collection('Calendar').insertMany(dataToSave)
}

const cheerioLoad = async (URL: string) => {
  const RequestToScrape = await fetch(URL)
  const RequestToText = await RequestToScrape.text()
  const $ = cheerio.load(RequestToText)
  return $
}
async function GetCalendarData(selector: string) {
  const CalendarData = []
  const BASEURL = process.env.URL_CALENDAR ?? ''
  const TodayDate = GetTodayDate()
  const URLDAYS = [`${BASEURL}/es/partidos/${TodayDate}`]
  const DAYSTOGET = 15
  let DAYS = 0
  let newDate: string | undefined = URLDAYS[0]
  while (DAYS <= DAYSTOGET) {
    const DateElement = newDate?.split('/')[5]
    const $ = await cheerioLoad(newDate as string)
    newDate = $(selector).attr('href')
    newDate = `${BASEURL}${newDate}`

    const Partidos: CalendarMatches[] = []

    $('.table_wrapper').each((index, element) => {
      const League = $(element).find('.section_heading > h2 > a')
      const LeagueName = $(League).text()
      const LeagueId = $(League).attr('href')?.split('/')[3]

      $(element)
        .find('.table_container > table > tbody > tr')
        .each((ind, data) => {
          Partidos.push({
            LeagueName,
            LeagueId,
            Ronda: $(data).find('[data-stat="round"]').text(),
            Jornada: $(data).find('[data-stat="gameweek"]').text(),
            Hora: $(data).find('[data-stat="start_time"]').find('.venuetime').text(),
            Local: $(data).find('[data-stat="home_team"]').find('a').text(),
            LocalTeamId: $(data).find('[data-stat="home_team"]').find('a').attr('href')?.split('/')[3],
            LocalXG: $(data).find('[data-stat="home_xg"]').text(),
            GolesLocal:
              $(data).find('[data-stat="score"]').find('a').text().length > 1
                ? Number($(data).find('[data-stat="score"]').find('a').text().split('–')[0])
                : null,
            GolesVisitante:
              $(data).find('[data-stat="score"]').find('a').text().length > 1
                ? Number($(data).find('[data-stat="score"]').find('a').text().split('–')[1])
                : null,
            VisitanteXG: $(data).find('[data-stat="away_xg"]').text(),
            Visitante: $(data).find('[data-stat="away_team"]').find('a').text(),
            VisitanteTeamId: $(data).find('[data-stat="away_team"]').find('a').attr('href')?.split('/')[3],
            Asistencia: $(data).find('[data-stat="attendance"]').text(),
            Estadio: $(data).find('[data-stat="venue"]').text(),
            Arbitro: $(data).find('[data-stat="referee"]').text(),
            EstadoDelPartido:
              $(data).find('[data-stat="score"]').find('a').text().length > 1 ? 'Finalizado' : 'No Empezado'
            // Jornada : $(data).find('[data-stat="gameweek"]').text(),
          })
        })
    })
    CalendarData.push({
      DateElement,
      Partidos: Partidos
    })
    // console.log(CalendarData)
    DAYS++
    await new Promise((r) => setTimeout(r, 6200))
    console.log(`${DAYS}/${DAYSTOGET}`)
  }
  return CalendarData
}
