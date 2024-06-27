import { CalendarMatches, saveDatabase } from '../../../../../types'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { randomUUID } from 'crypto'
import { GetTeamsIcons } from '@/app/utils/GetTeamsIcons'
import { cheerioLoad } from '@/app/utils/CheerioLoad'

// type Element = cheerio.Element
export const GET = async () => {
  const CalendarDataNext: saveDatabase[] = await GetCalendarData('#content > div.prevnext > a.button2.next')
  const CalendarDataPlayed: saveDatabase[] = await GetCalendarData('#content > div.prevnext > a.button2.prev')
  CalendarDataPlayed.shift()
  await SaveData(CalendarDataNext, true)
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

// export const cheerioLoad = async (URL: string) => {
//   console.log(URL)
//   const RequestToScrape = await fetch(URL, { cache: 'no-store' })
//   const RequestToText = await RequestToScrape.text()
//   const $ = cheerio.load(RequestToText)
//   return $
// }
async function GetCalendarData(selector: string) {
  const CalendarData = []
  const BASEURL = process.env.URL_CALENDAR ?? ''
  const TodayDate = GetTodayDate()
  const URLDAYS = [`${BASEURL}/es/partidos/${TodayDate}`]
  const DAYSTOGET = 2
  let DAYS = 0
  let newDate: string | undefined = URLDAYS[0]
  while (DAYS <= DAYSTOGET) {
    const DateElement = newDate?.split('/')[5]
    const $ = await cheerioLoad(newDate as string)
    newDate = $(selector).attr('href')
    newDate = `${BASEURL}${newDate}`

    const Partidos: CalendarMatches[] = []

    const elementsTable = $('.table_wrapper').toArray()

    for (const elementTable of elementsTable) {
      const League = $(elementTable).find('.section_heading > h2 > a')
      const LeagueName = $(League).text()
      const LeagueId = $(League).attr('href')?.split('/')[3]

      const LeagueLink = `${BASEURL}${$(elementTable).find('h2').find('a').attr('href')}`
      const LeaguePage = await cheerioLoad(LeagueLink)
      const LeagueIconPrev = LeaguePage('#meta > div.media-item.logo > img').attr('src')
      const LeagueIcon = await GetTeamsIcons(LeagueIconPrev as string)
      const LeagueRegion = $(elementTable)
        .find('.section_heading > h2 > span')
        .attr('class')
        ?.split(' ')[1]
        .split('-')[1]
        .toUpperCase()
        .trim()

      const elements = $(elementTable).find('.table_container > table > tbody > tr').toArray()

      for (const data of elements) {
        console.log('Inicio')
        const LocalTeamImage = await GetTeamImage(BASEURL, $, data, 'home_team')
        await new Promise((r) => setTimeout(r, 10200))
        const AwayTeamImage = await GetTeamImage(BASEURL, $, data, 'away_team')

        Partidos.push({
          LeagueName,
          LeagueId,
          LeagueRegion,
          LeagueIcon,
          MatchId: randomUUID(),
          Ronda: $(data).find('[data-stat="round"]').text(),
          Jornada: $(data).find('[data-stat="gameweek"]').text(),
          Hora: $(data).find('[data-stat="start_time"]').find('.venuetime').text(),
          Local: $(data).find('[data-stat="home_team"]').find('a').text(),
          LocalTeamImage,
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
          AwayTeamImage,
          VisitanteTeamId: $(data).find('[data-stat="away_team"]').find('a').attr('href')?.split('/')[3],
          Asistencia: $(data).find('[data-stat="attendance"]').text(),
          Estadio: $(data).find('[data-stat="venue"]').text(),
          Arbitro: $(data).find('[data-stat="referee"]').text(),
          EstadoDelPartido:
            $(data).find('[data-stat="score"]').find('a').text().length > 1 ? 'Finalizado' : 'No Empezado'
        })
        console.log('Termina await')
      }
    }

    CalendarData.push({
      DateElement,
      Partidos: Partidos
    })
    // console.log(CalendarData)
    DAYS++
    await new Promise((r) => setTimeout(r, 10200))
    console.log(`${DAYS}/${DAYSTOGET}`)
  }
  return CalendarData
}
async function GetTeamImage(BASEURL: string, $: cheerio.Root, data: cheerio.Element, team: string) {
  const localTeamLink = `${BASEURL}${$(data).find(`[data-stat="${team}"]`).find('a').attr('href')}`
  const localTeamTab = await cheerioLoad(localTeamLink)
  const GetLocalTeamCode = localTeamTab(`#meta > div.media-item.country > span`)
    .attr('class')
    ?.split(' ')[1]
    .split('-')[1]
    .toUpperCase()
  const localTeamImage =
    localTeamTab('#meta > div.media-item.logo > img').attr('src') !== undefined
      ? localTeamTab('#meta > div.media-item.logo > img').attr('src')
      : `https://flagsapi.com/${GetLocalTeamCode}/flat/64.png`

  console.log(localTeamImage)
  const teamImage = GetTeamsIcons(localTeamImage as string)

  return teamImage
}
