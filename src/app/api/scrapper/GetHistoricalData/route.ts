import { GetTeamsIcons } from './../../../services/GetTeamsIcons'
import { headers } from 'next/headers'
import {
  MatchInformation,
  LeagueInformation,
  MaximoGoleador,
  MaximoAsistente,
  MaxPorteriasACero,
  LineUp,
  GameEvents,
  Stats,
  StatsDetailsF,
  TeamPlayerData,
  TeamPorteroData
} from '../../../../../types'
import * as cheerio from 'cheerio'
type Element = cheerio.Element

import { MongoClient, ServerApiVersion } from 'mongodb'

const client = new MongoClient(process.env.DB_URL ?? '', {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

// Llamada a la API para Obtener Los partidos jugados de una temporada.
export async function POST() {
  const URL: string | null = headers().get('link')
  const PASSWORD = headers().get('password')
  const bulk = false

  if (PASSWORD !== process.env.PASSWORD_SCRAPPER) {
    return Response.json({ error: 'Contraseña Incorrecta' })
  }
  if (URL === null) {
    return Response.json({ error: 'URL No Proporcionada' })
  }

  if (bulk) {
    const URL: string[] = [
      'https://fbref.com/es/comps/22/2023/horario/Marcadores-y-partidos-de-2023-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2022/horario/Marcadores-y-partidos-de-2022-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2021/horario/Marcadores-y-partidos-de-2021-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2020/horario/Marcadores-y-partidos-de-2020-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2019/horario/Marcadores-y-partidos-de-2019-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2018/horario/Marcadores-y-partidos-de-2018-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2017/horario/Marcadores-y-partidos-de-2017-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2016/horario/Marcadores-y-partidos-de-2016-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2015/horario/Marcadores-y-partidos-de-2015-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2014/horario/Marcadores-y-partidos-de-2014-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2013/horario/Marcadores-y-partidos-de-2013-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2012/horario/Marcadores-y-partidos-de-2012-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2011/horario/Marcadores-y-partidos-de-2011-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2010/horario/Marcadores-y-partidos-de-2010-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2009/horario/Marcadores-y-partidos-de-2009-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2008/horario/Marcadores-y-partidos-de-2008-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2007/horario/Marcadores-y-partidos-de-2007-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2006/horario/Marcadores-y-partidos-de-2006-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2005/horario/Marcadores-y-partidos-de-2005-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2004/horario/Marcadores-y-partidos-de-2004-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2003/horario/Marcadores-y-partidos-de-2003-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2002/horario/Marcadores-y-partidos-de-2002-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2001/horario/Marcadores-y-partidos-de-2001-Major-League-Soccer',
      'https://fbref.com/es/comps/22/2000/horario/Marcadores-y-partidos-de-2000-Major-League-Soccer',
      'https://fbref.com/es/comps/22/1999/horario/Marcadores-y-partidos-de-1999-Major-League-Soccer',
      'https://fbref.com/es/comps/22/1998/horario/Marcadores-y-partidos-de-1998-Major-League-Soccer',
      'https://fbref.com/es/comps/22/1997/horario/Marcadores-y-partidos-de-1997-Major-League-Soccer',
      'https://fbref.com/es/comps/22/1996/horario/Marcadores-y-partidos-de-1996-Major-League-Soccer'
    ]
    for (const link of URL) {
      const data = await Scrape(link)
      const cleanData = await CheckIfMatchExists(data, 'Matches')
      if (cleanData.length > 0) {
        const FinalData = await MatchesDetails(cleanData as MatchInformation[])
        await SaveData(FinalData as MatchInformation[], 'Matches')
        // return Response.json({ message: FinalData })
      }
    }
    return Response.json({
      message: 'Datos Añadidos Correctamente a la base de Datos'
    })
  }

  const data = await Scrape(URL)
  const cleanData = await CheckIfMatchExists(data, 'Matches')
  if (cleanData.length > 0) {
    const FinalData = await MatchesDetails(cleanData as MatchInformation[])
    await SaveData(FinalData as MatchInformation[], 'Matches')
    return Response.json({ message: FinalData })
  }

  return Response.json({ message: 'No hay Datos Para Actualizar' })
}

const Scrape = async (URL: string): Promise<MatchInformation[]> => {
  const RequestToScrape = await fetch(URL)
  const RequestToText = await RequestToScrape.text()
  const $ = cheerio.load(RequestToText)

  const { Pais, LeagueImage, Liga, Año, Genero, LeagueId } = await GetBasicData($, URL)
  const LeagueInfo: LeagueInformation[] = GetLeagueInformation(
    $,
    Pais,
    LeagueImage,
    Liga,
    LeagueId,
    Año,
    Genero
  )
  const cleanData = await CheckIfMatchExists(LeagueInfo, 'Leagues')
  if (cleanData.length > 0) {
    await SaveData(LeagueInfo[0], 'Leagues')
  }

  // Ahora Scrapeamos la tabla:
  const MatchInformation: MatchInformation[] = GetAllMatchsDetails($, URL, Liga, Año, Pais, Genero)
  return MatchInformation
}

const SaveData = async (dataToSave: MatchInformation[] | LeagueInformation, collectionName: string) => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect()
    // Send a ping to confirm a successful connection
    if (collectionName === 'Matches') {
      await client
        .db('EstadisticasFutbol')
        .collection(collectionName)
        .insertMany(dataToSave as MatchInformation[])
    } else if (collectionName === 'Leagues') {
      await client.db('EstadisticasFutbol').collection(collectionName).insertOne(dataToSave)
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close()
  }
}

const CheckIfMatchExists = async (
  dataToSave: MatchInformation[] | LeagueInformation[],
  collection: string
): Promise<MatchInformation[] | LeagueInformation[]> => {
  const DataSinDuplicados: MatchInformation[] = []
  const LeagueSinDuplicados: LeagueInformation[] = []
  try {
    await client.connect()
    const result = await client.db('EstadisticasFutbol').collection(collection).find().toArray()

    if (collection === 'Matches') {
      ;(dataToSave as MatchInformation[]).forEach((element) => {
        let isDuplicate = false
        result.forEach((data) => {
          if ((element as MatchInformation).MatchId === data.MatchId) {
            console.log('Elemento Duplicado')
            isDuplicate = true
          }
        })
        if (!isDuplicate) {
          DataSinDuplicados.push(element)
        }
      })
      return DataSinDuplicados
    } else if (collection === 'Leagues') {
      ;(dataToSave as LeagueInformation[]).forEach((element) => {
        let isDuplicate = false
        result.forEach((data) => {
          if (
            (element as LeagueInformation).LeagueId === data.LeagueId &&
            (element as LeagueInformation).Año === data.Año
          ) {
            console.log('Elemento Duplicado')
            isDuplicate = true
          }
        })
        if (!isDuplicate) {
          LeagueSinDuplicados.push(element)
        }
      })
      return LeagueSinDuplicados
    }
  } catch {
    console.log('error getting db')
  } finally {
    await client.close()
  }

  return DataSinDuplicados
}

const MatchesDetails = async (data: MatchInformation[]) => {
  const Details = []
  for (const element of data) {
    const URL = `${process.env.URL}${element.MatchDetails}`
    const RequestToScrape = await fetch(URL)
    const RequestToText = await RequestToScrape.text()
    const $ = cheerio.load(RequestToText)
    // Logo Ambos Equipos
    const LocalTeamImage = await GetTeamImage($, '1')
    const AwayTeamImage = await GetTeamImage($, '2')

    // Capitan y manager
    const LocalData: string[] = GetCaptainAndManager($, '#content > div.scorebox > div:nth-child(1)')
    const AwayData: string[] = GetCaptainAndManager($, '#content > div.scorebox > div:nth-child(2)')

    // Alineaciones
    const AlineacionLocal: LineUp[] = GetLineUp($, '#a > table > tbody')
    const AlineacionVisitante: LineUp[] = GetLineUp($, '#b > table > tbody')

    // Eventos

    const LocalEvents: GameEvents[] = GetMatchEvents($, '.a')
    const AwayEvents: GameEvents[] = GetMatchEvents($, '.b')

    // Game Stats
    const Stats: Stats[] = GetGameStats($)

    //Game Stats Xtra
    const StatsDetails: StatsDetailsF[] = GameStatsXtra($)

    // Player Stats
    const { LocalTeamPlayersData, LocalTeamPorterosData } = LocalPlayersData($)

    const { AwayTeamPlayersData, AwayTeamPorterosData } = AwayPlayersData($)

    Details.push({
      ...element,
      LocalTeamImage,
      AwayTeamImage,
      DatosLocal: {
        Entrenador: LocalData[0],
        Capitan: LocalData[1],
        AlineacionLocal,
        LocalEvents
      },
      DatosVisitante: {
        Entrenador: AwayData[0],
        Capitan: AwayData[1],
        AlineacionVisitante,
        AwayEvents
      },
      Stats,
      StatsDetails,
      LocalTeamPlayersData,
      LocalTeamPorterosData,
      AwayTeamPlayersData,
      AwayTeamPorterosData
    })
    await new Promise((r) => setTimeout(r, 3200))
    console.log(`Partido Completado : ${Details.length}/${data.length}`)
  }
  return Details
}

// Funciones de la function Scrape

async function GetBasicData($: cheerio.Root, URL: string) {
  const Pais = $('#meta > div:nth-child(2) > p:nth-child(3) > a').text()
  const Genero =
    $('#meta > div:nth-child(2) > p:nth-child(5)').text().trim().split(' ')[0] === 'Género:'
      ? $('#meta > div:nth-child(2) > p:nth-child(5)').text().split(' ')[1]
      : $('#meta > div:nth-child(2) > p:nth-child(4)').text().split(' ')[1]

  const Liga = $('#meta > div:nth-child(2) > h1').text().split(' ').slice(5).join().trim().replace(',', ' ')
  const Año = $('#meta > div:nth-child(2) > h1').text().split(' ')[4]
  const LeagueImage = await GetTeamsIcons($('#meta > div.media-item.logo > img').attr('src'))
  const LeagueId = URL.split('/')[5]
  return { Pais, LeagueImage, Liga, Año, Genero, LeagueId }
}

function GetLeagueInformation(
  $: cheerio.Root,
  Pais: string,
  LeagueImage: string | undefined,
  Liga: string,
  LeagueId: string,
  Año: string,
  Genero: string
) {
  const LeagueStats = $('#meta > div:nth-child(2)')
  const VariosGoleadores: MaximoGoleador[] = []
  const VariosAsistentes: MaximoAsistente[] = []
  const VariosPorteriasACero: MaxPorteriasACero[] = []

  LeagueStats.find('p').each((i, stat) => {
    if (stat !== undefined) {
      const stats = $(stat)?.text()?.split(':')[0]
      const dataStats = $(stat)?.text()?.split(':')[1]?.split(',')
      if (stats === 'Más Goles') {
        dataStats.forEach((element, i) => {
          const Playerid: string[] = []

          $(stat)
            .children('a')
            .each((index, text) => {
              Playerid.push($(text).attr('href') as string)
            })
          VariosGoleadores.push({
            Nombre: element.split('(')[0].trim(),
            Equipo: element.split('(')[1].split(')')[0].trim(),
            Goles: dataStats[dataStats.length - 1].split('-')[1].trim(),
            PlayerId: Playerid[i].split('/')[3]
          })
        })
      }
      if (stats === 'Más Asistencias') {
        dataStats.forEach((element, i) => {
          // if(dataStats.length)
          const Playerid: string[] = []
          $(stat)
            .children('a')
            .each((index, text) => {
              Playerid.push($(text).attr('href') as string)
            })
          VariosAsistentes.push({
            Nombre: element.split('(')[0].trim(),
            Equipo: element.split('(')[1].split(')')[0].trim(),
            Asistencias: dataStats[dataStats.length - 1].split('-')[1].trim(),
            PlayerId: Playerid[i].split('/')[3]
          })
        })
      }
      if (stats === 'Mayor Porterías a Cero') {
        dataStats.forEach((element, i) => {
          // if(dataStats.length)
          const Playerid: string[] = []

          $(stat)
            .children('a')
            .each((index, text) => {
              Playerid.push($(text).attr('href') as string)
            })

          VariosPorteriasACero.push({
            Nombre: element.split('(')[0].trim(),
            Equipo: element.split('(')[1].split(')')[0].trim(),
            PorteriasACero: dataStats[dataStats.length - 1].split('-')[1].trim(),
            PlayerId: Playerid[i].split('/')[3]
          })
        })
      }
    }
  })

  const LeagueInfo: LeagueInformation[] = [
    {
      Pais,
      LeagueImage,
      Liga,
      Genero,
      LeagueId,
      Año,
      Campeon: {
        TeamName:
          $('#meta > div:nth-child(2) > p:nth-child(6) > strong').text() === 'Campeón'
            ? $('#meta > div:nth-child(2) > p:nth-child(6) > a').text()
            : $('#meta > div:nth-child(2) > p:nth-child(5) > a').text(),
        TeamId:
          $('#meta > div:nth-child(2) > p:nth-child(6) > strong').text() === 'Campeón'
            ? $('#meta > div:nth-child(2) > p:nth-child(6) > a').attr('href')?.split('/')[3]
            : $('#meta > div:nth-child(2) > p:nth-child(5) > a').attr('href')?.split('/')[3]
      },
      MaximoGoleador: VariosGoleadores,
      MaximoAsistente: VariosAsistentes,
      MaxPorteriasACero: VariosPorteriasACero
    }
  ]
  return LeagueInfo
}

function GetAllMatchsDetails(
  $: cheerio.Root,
  URL: string,
  Liga: string,
  Año: string,
  Pais: string,
  Genero: string
) {
  const MatchTable = $('.stats_table:first')
  const MatchInformation: MatchInformation[] = []

  MatchTable.find('tr')
    .not('.partial_table')
    .each((i: number, row: Element) => {
      const EquipoLocal = $(row).find($('[data-stat="home_team"]')).children().html()
      if ($(row).attr('class') !== 'thead' && $(row).find($('[data-stat="score"]')).text().length > 0) {
        const Jornada =
          Number($(row).find($('[data-stat="gameweek"]')).text()) === Number('')
            ? $(row).find($('[data-stat="round"]')).text()
            : Number($(row).find($('[data-stat="gameweek"]')).text())

        const Ronda = $(row).find($('[data-stat="round"]')).text()

        const Dia = $(row).find($('[data-stat="dayofweek"]')).text()
        const Fecha = $(row).find($('[data-stat="date"]')).text()
        const Hora = $(row).find($('[data-stat="start_time"]')).text().trim()
        const EquipoLocalId = $(row).find($('[data-stat="home_team"]')).children().attr('href')?.split('/')[3]

        const EquipoLocalXG = Number($(row).find($('[data-stat="home_xg"]')).text())

        const EquipoLocalPenaltis = Number(
          $(row).find($('[data-stat="score"]')).children('small:last-child').text().split('')[1]
        )

        const Resultado = $(row).find($('[data-stat="score"]')).children('a').text().split('–')
        const EquipoLocalGoles = Number(Resultado[0])
        const EquipoVisitanteGoles = Number(Resultado[1])

        const EquipoVisitantePenaltis = Number(
          $(row).find($('[data-stat="score"]')).children('small:first-child').text().split('')[1]
        )

        const EquipoVisitanteXG = Number($(row).find($('[data-stat="away_xg"]')).text())
        const EquipoVisitante = $(row).find($('[data-stat="away_team"]')).children('a').text()

        const EquipoVisitanteId = $(row)
          .find($('[data-stat="away_team"]'))
          .children('a')
          .attr('href')
          ?.split('/')[3]

        const Asistencia = $(row).find($('[data-stat="attendance"]')).text() //parseInt(str.replace(/,/g, ''), 10);

        const Estadio = $(row).find($('[data-stat="venue"]')).text()
        const Arbitro = $(row).find($('[data-stat="referee"]')).text()
        const LeagueId = URL.split('/')[5]
        const MatchReport = $(row).find($('[data-stat="match_report"]'))
        const children = $(MatchReport).children()
        let matchId = '0000000'
        let matchDetails = '00000'
        if (children && matchId !== undefined) {
          matchId = children.attr('href')?.split('/')[3] as string
          matchDetails = children.attr('href') as string
        }

        if (i !== 0) {
          MatchInformation.push({
            Liga,
            Año,
            Pais,
            Genero,
            Ronda,
            Jornada,
            Dia,
            Fecha,
            Hora,
            EquipoLocal,
            EquipoLocalId,
            EquipoLocalXG,
            EquipoLocalGoles,
            EquipoLocalPenaltis,
            EquipoVisitanteGoles,
            EquipoVisitanteXG,
            EquipoVisitante,
            EquipoVisitanteId,
            EquipoVisitantePenaltis,
            Asistencia,
            Estadio,
            Arbitro,
            MatchId: matchId,
            LeagueId,
            MatchDetails: matchDetails
          })
        }
      }
    })
  return MatchInformation
}

function GetMatchEvents($: cheerio.Root, selector: string) {
  const Events: GameEvents[] = []
  $('#events_wrap > div')
    .children(selector)
    .each((index, element) => {
      const Evento = $(element).children('div').last().children('.event_icon').attr('class')?.split(' ')[1]
      const Jugador = $(element)
        .children('div')
        .last()
        .children('div:nth-child(2)')
        .children('div')
        .text()
        .trim()
      const JugadorId = $(element)
        .children('div')
        .last()
        .children('div:nth-child(2)')
        .children('div')
        .children('a')
        .attr('href')
        ?.split('/')[3]

      const Minuto = $(element)
        .last()
        .children('div')
        .first()
        .text()
        .split('\n\t\t\t\t\t')[1]
        .split('’')[0]
        .trim()
      const Info =
        $(element)
          .children('div')
          .last()
          .children('div:nth-child(2)')
          .children('small')
          .children('a')
          .html() !== null
          ? $(element)
              .children('div')
              .last()
              .children('div:nth-child(2)')
              .children('small')
              .children('a')
              .html()
          : $(element).children('div').last().children('div:nth-child(2)').children('small').html()

      Events.push({ Evento, Jugador, JugadorId, Minuto, Info })
    })
  return Events
}

function GetGameStats($: cheerio.Root) {
  const Stats: Stats[] = []
  const StatsName: string[] = []
  const StatsData: string[] = []
  const StatsAway: string[] = []
  const successfulArray: string[] = []
  const TotalArray: string[] = []
  const successfulArrayAway: string[] = []
  const TotalArrayAway: string[] = []
  let LocalAmarillas: number | undefined | string
  let LocalRojas: number
  let VisitanteAmarillas: number
  let VisitanteRojas: number
  $('#team_stats > table > tbody > tr').each((index, element) => {
    if (index > 0) {
      const statName = $(element).children('th').text()
      if (statName.length > 0) {
        StatsName.push(statName)
      }
      const localData = $(element)
        .children('td')
        .first()
        .children('div')
        .children('div')
        .children('strong')
        .text()
        .trim()

      const successful = $(element)
        .children('td')
        .first()
        .children('div')
        .children('div')
        .not('strong')
        .text()
        .split('-')[0]
        .split('of')[0]

      const total = $(element)
        .children('td')
        .first()
        .children('div')
        .children('div')
        .not('strong')
        .text()
        .split('—')[0]
        .split('of')[1]

      if (localData.length > 0) {
        StatsData.push(localData)
        TotalArray.push(total)
        if (successful.indexOf('%') === -1) {
          successfulArray.push(successful)
        } else {
          successfulArray.push('null')
        }
      }

      const AwayData = $(element)
        .children('td')
        .last()
        .children('div')
        .children('div')
        .children('strong')
        .text()
        .trim()

      const successfulAway = $(element)
        .children('td')
        .last()
        .children('div')
        .children('div')
        .not('strong')
        .text()
        ?.split('—')[1]
        ?.split('of')[0]

      const totalAway = $(element)
        .children('td')
        .last()
        .children('div')
        .children('div')
        .not('strong')
        .text()
        ?.split('—')[1]
        ?.split('of')[1]

      if (AwayData.length > 0) {
        StatsAway.push(AwayData)
        TotalArrayAway.push(totalAway)
        if (successfulAway && successfulAway.indexOf('%') === -1) {
          successfulArrayAway.push(successfulAway)
        } else {
          successfulArrayAway.push('null')
        }
      }

      const LocalTarjetas: string[] = []
      $(element)
        .children('td')
        .first()
        .children('div')
        .children('div')
        .children('.cards')
        .children()
        .each((index, element) => {
          LocalTarjetas.push($(element).attr('class') as string)
        })
      LocalAmarillas = LocalTarjetas.filter((word) => word === 'yellow_card').length
      LocalRojas = LocalTarjetas.filter((word) => word === 'red_card').length

      const VisitanteTarjetas: string[] = []
      $(element)
        .children('td')
        .last()
        .children('div')
        .children('div')
        .children('.cards')
        .children()
        .each((index, element) => {
          VisitanteTarjetas.push($(element).attr('class') as string)
        })
      VisitanteAmarillas = VisitanteTarjetas.filter((word) => word === 'yellow_card').length
      VisitanteRojas = VisitanteTarjetas.filter((word) => word === 'red_card').length
    }
  })

  StatsName.forEach((element, index) => {
    if (StatsName.length > 1) {
      if (element !== 'Tarjetas') {
        Stats.push({
          [StatsName[index]]: {
            PorcentajeLocal: StatsData[index],
            PorcentajeAway: StatsAway[index],
            CompletadosLocal: successfulArray[index],
            TotalesLocal: TotalArray[index],
            CompletadosVisitante: successfulArrayAway[index],
            TotalesVisitante: TotalArrayAway[index]
          }
        })
      }
      if (element === 'Tarjetas') {
        Stats.push({
          Tarjetas: {
            LocalAmarillas,
            LocalRojas,
            VisitanteAmarillas,
            VisitanteRojas
          }
        })
      }
    }
  })
  return Stats
}

function GameStatsXtra($: cheerio.Root) {
  const StatsDetails: StatsDetailsF[] = []
  $('#team_stats_extra')
    .children('div')
    .each((index, element) => {
      let initial = 5
      let LocalData = 4
      let AwayData = 6
      $(element)
        .children('div')
        .each((i) => {
          if (i > 2) {
            if ($(element).children(`div:nth-child(${initial})`).html() !== null) {
              const StatsXtra = {
                [$(element).children(`div:nth-child(${initial})`).text()]: {
                  Local: $(element).children(`div:nth-child(${LocalData})`).text(),
                  Visitante: $(element).children(`div:nth-child(${AwayData})`).text()
                }
              }
              StatsDetails.push(StatsXtra)
              initial = initial + 3
              LocalData = LocalData + 3
              AwayData = AwayData + 3
            }
          }
        })
    })
  return StatsDetails
}

function AwayPlayersData($: cheerio.Root) {
  const AwayTeamPlayersData: TeamPlayerData[] = []
  $('.current > table:nth-child(1) > tbody').each((index, element) => {
    if (index === 1) {
      $(element)
        .children('tr')
        .each((inde, element) => {
          AwayTeamPlayersData.push({
            Player: $(element).find($('[data-stat="player"]')).text().trim(),
            PlayerId: $(element).find($('[data-stat="player"]')).children('a').attr('href')?.split('/')[3],
            PlayerNumber: $(element).find($('[data-stat="shirtnumber"]')).text().trim(),
            Pais: $(element).find($('[data-stat="nationality"]')).text().trim()?.split(' ')[1],
            PaisId: $(element).find($('[data-stat="nationality"]')).children('a').attr('href'),
            Position: $(element).find($('[data-stat="position"]')).text().trim(),
            Edad: $(element).find($('[data-stat="age"]')).text().trim(),
            MinutosJugados: $(element).find($('[data-stat="minutes"]')).text().trim(),
            Rendimiento: {
              Goles: $(element).find($('[data-stat="goals"]')).text().trim(),
              Asistencias: $(element).find($('[data-stat="assists"]')).text().trim(),
              PenaltiEjecutado: $(element).find($('[data-stat="pens_made"]')).text().trim(),
              TotalPenaltisTirados: $(element).find($('[data-stat="pens_att"]')).text().trim(),
              Tiros: $(element).find($('[data-stat="shots"]')).text().trim(),
              TirosAPuerta: $(element).find($('[data-stat="shots_on_target"]')).text().trim(),
              TarjetasAmarillas: $(element).find($('[data-stat="cards_yellow"]')).text().trim(),
              TarjetasRojas: $(element).find($('[data-stat="cards_red"]')).text().trim(),
              Toques: $(element).find($('[data-stat="touches"]')).text().trim(),
              Entradas: $(element).find($('[data-stat="tackles"]')).text().trim(),
              Intercepciones: $(element).find($('[data-stat="interceptions"]')).text().trim(),
              Bloqueos: $(element).find($('[data-stat="blocks"]')).text().trim()
            },
            Expectativas: {
              xG: $(element).find($('[data-stat="xg"]')).text().trim(),
              xGNoPenaltis: $(element).find($('[data-stat="npxg"]')).text().trim()
            },
            ACT: {
              AccionesCreacionDeTiros: $(element).find($('[data-stat="sca"]')).text().trim(),
              AccionesCreacionDeGoles: $(element).find($('[data-stat="gca"]')).text().trim()
            },
            Pases: {
              PasesCompletados: $(element).find($('[data-stat="passes_completed"]')).text().trim(),
              TotalPasesIntentados: $(element).find($('[data-stat="passes"]')).text().trim(),
              PorcentajePaseCompletado: $(element).find($('[data-stat="passes_pct"]')).text().trim(),
              PasesProgresivos: $(element).find($('[data-stat="progressive_passes"]')).text().trim()
            },
            Transportes: {
              ControlesDeBalon: $(element).find($('[data-stat="carries"]')).text().trim(),
              ControlesDeBalonProgresivo: $(element)
                .find($('[data-stat="progressive_carries"]'))
                .text()
                .trim()
            },
            Regates: {
              RegatesIntentados: $(element).find($('[data-stat="take_ons"]')).text().trim(),
              RegatesConseguidosConExito: $(element).find($('[data-stat="take_ons_won"]')).text().trim()
            }
          })
        })
    }
  })

  const AwayTeamPorterosData: TeamPorteroData[] = []
  $('.stats_table:nth-child(1) > tbody')
    .children('tr')
    .find($('[data-stat="gk_shots_on_target_against"]'))
    .parent()
    .parent()
    .last()
    .children('tr')
    .each((index, element) => {
      AwayTeamPorterosData.push({
        PlayerName: $(element).find($('[data-stat="player"]')).text(),
        PlayerId: $(element).find($('[data-stat="player"]')).children('a').attr('href'),
        ParadasATiros: {
          DisparosAPuertaEnContra: $(element).find($('[data-stat="gk_shots_on_target_against"]')).text(),
          GolesEnContra: $(element).find($('[data-stat="gk_goals_against"]')).text(),
          Paradas: $(element).find($('[data-stat="gk_saves"]')).text(),
          PorcentajeDeSalvadas: $(element).find($('[data-stat="gk_save_pct"]')).text(),
          GolesEsperadosPosteriorAlTiro: $(element).find($('[data-stat="gk_psxg"]')).text()
        },
        PasesIniciados: {
          PasesCompletadosIniciados: $(element).find($('[data-stat="gk_passes_completed_launched"]')).text(),
          PasesIntentadosCompletados: $(element).find($('[data-stat="gk_passes_pct_launched"]')).text(),
          PorcentajePasesIniciadosCompletados: $(element)
            .find($('[data-stat="gk_passes_pct_launched"]'))
            .text()
        },
        Pases: {
          PasesIntentados: $(element).find($('[data-stat="gk_passes"]')).text(),
          TirosIntentados: $(element).find($('[data-stat="gk_passes_throws"]')).text(),
          PorcentajeDePasesRealizados: $(element).find($('[data-stat="gk_pct_passes_launched"]')).text(),
          LongitudMediaDelPase: $(element).find($('[data-stat="gk_passes_length_avg"]')).text()
        },
        SaquesDePuerta: {
          SaquesDePuerta: $(element).find($('[data-stat="gk_goal_kicks"]')).text(),
          PorcentajeSaquesDePuertaLargos: $(element)
            .find($('[data-stat="gk_pct_goal_kicks_launched"]'))
            .text(),
          LongitudMediaDelSaque: $(element).find($('[data-stat="gk_goal_kick_length_avg"]')).text()
        },
        PasesCruzados: {
          CrucesSuperados: $(element).find($('[data-stat="gk_crosses"]')).text(),
          CrucesDetenidos: $(element).find($('[data-stat="gk_crosses_stopped"]')).text(),
          PorcentajeCrucesDetenidos: $(element).find($('[data-stat="gk_crosses_stopped_pct"]')).text()
        },
        Barredora: {
          DefensaFueraDelArea: $(element).find($('[data-stat="gk_def_actions_outside_pen_area"]')).text(),
          DistanciaPromediaDesdeLaPorteria: $(element)
            .find($('[data-stat="gk_avg_distance_def_actions"]'))
            .text()
        }
      })
    })
  return { AwayTeamPlayersData, AwayTeamPorterosData }
}

function LocalPlayersData($: cheerio.Root) {
  const LocalTeamPlayersData: TeamPlayerData[] = []
  $('.stats_table > tbody')
    .first()
    .children('tr')
    .each((index, element) => {
      LocalTeamPlayersData.push({
        Player: $(element).find($('[data-stat="player"]')).text().trim(),
        PlayerId: $(element).find($('[data-stat="player"]')).children('a').attr('href')?.split('/')[3],
        PlayerNumber: $(element).find($('[data-stat="shirtnumber"]')).text().trim(),
        Pais: $(element).find($('[data-stat="nationality"]')).text().trim()?.split(' ')[1],
        PaisId: $(element).find($('[data-stat="nationality"]')).children('a').attr('href'),
        Position: $(element).find($('[data-stat="position"]')).text().trim(),
        Edad: $(element).find($('[data-stat="age"]')).text().trim(),
        MinutosJugados: $(element).find($('[data-stat="minutes"]')).text().trim(),
        Rendimiento: {
          Goles: $(element).find($('[data-stat="goals"]')).text().trim(),
          Asistencias: $(element).find($('[data-stat="assists"]')).text().trim(),
          PenaltiEjecutado: $(element).find($('[data-stat="pens_made"]')).text().trim(),
          TotalPenaltisTirados: $(element).find($('[data-stat="pens_att"]')).text().trim(),
          Tiros: $(element).find($('[data-stat="shots"]')).text().trim(),
          TirosAPuerta: $(element).find($('[data-stat="shots_on_target"]')).text().trim(),
          TarjetasAmarillas: $(element).find($('[data-stat="cards_yellow"]')).text().trim(),
          TarjetasRojas: $(element).find($('[data-stat="cards_red"]')).text().trim(),
          Toques: $(element).find($('[data-stat="touches"]')).text().trim(),
          Entradas: $(element).find($('[data-stat="tackles"]')).text().trim(),
          Intercepciones: $(element).find($('[data-stat="interceptions"]')).text().trim(),
          Bloqueos: $(element).find($('[data-stat="blocks"]')).text().trim()
        },
        Expectativas: {
          xG: $(element).find($('[data-stat="xg"]')).text().trim(),
          xGNoPenaltis: $(element).find($('[data-stat="npxg"]')).text().trim()
        },
        ACT: {
          AccionesCreacionDeTiros: $(element).find($('[data-stat="sca"]')).text().trim(),
          AccionesCreacionDeGoles: $(element).find($('[data-stat="gca"]')).text().trim()
        },
        Pases: {
          PasesCompletados: $(element).find($('[data-stat="passes_completed"]')).text().trim(),
          TotalPasesIntentados: $(element).find($('[data-stat="passes"]')).text().trim(),
          PorcentajePaseCompletado: $(element).find($('[data-stat="passes_pct"]')).text().trim(),
          PasesProgresivos: $(element).find($('[data-stat="progressive_passes"]')).text().trim()
        },
        Transportes: {
          ControlesDeBalon: $(element).find($('[data-stat="carries"]')).text().trim(),
          ControlesDeBalonProgresivo: $(element).find($('[data-stat="progressive_carries"]')).text().trim()
        },
        Regates: {
          RegatesIntentados: $(element).find($('[data-stat="take_ons"]')).text().trim(),
          RegatesConseguidosConExito: $(element).find($('[data-stat="take_ons_won"]')).text().trim()
        }
      })
    })

  const LocalTeamPorterosData: TeamPorteroData[] = []
  $('.stats_table:nth-child(1) > tbody')
    .children('tr')
    .find($('[data-stat="gk_shots_on_target_against"]'))
    .parent()
    .parent()
    .first()
    .children('tr')
    .each((index, element) => {
      LocalTeamPorterosData.push({
        PlayerName: $(element).find($('[data-stat="player"]')).text(),
        PlayerId: $(element).find($('[data-stat="player"]')).children('a').attr('href'),
        ParadasATiros: {
          DisparosAPuertaEnContra: $(element).find($('[data-stat="gk_shots_on_target_against"]')).text(),
          GolesEnContra: $(element).find($('[data-stat="gk_goals_against"]')).text(),
          Paradas: $(element).find($('[data-stat="gk_saves"]')).text(),
          PorcentajeDeSalvadas: $(element).find($('[data-stat="gk_save_pct"]')).text(),
          GolesEsperadosPosteriorAlTiro: $(element).find($('[data-stat="gk_psxg"]')).text()
        },
        PasesIniciados: {
          PasesCompletadosIniciados: $(element).find($('[data-stat="gk_passes_completed_launched"]')).text(),
          PasesIntentadosCompletados: $(element).find($('[data-stat="gk_passes_pct_launched"]')).text(),
          PorcentajePasesIniciadosCompletados: $(element)
            .find($('[data-stat="gk_passes_pct_launched"]'))
            .text()
        },
        Pases: {
          PasesIntentados: $(element).find($('[data-stat="gk_passes"]')).text(),
          TirosIntentados: $(element).find($('[data-stat="gk_passes_throws"]')).text(),
          PorcentajeDePasesRealizados: $(element).find($('[data-stat="gk_pct_passes_launched"]')).text(),
          LongitudMediaDelPase: $(element).find($('[data-stat="gk_passes_length_avg"]')).text()
        },
        SaquesDePuerta: {
          SaquesDePuerta: $(element).find($('[data-stat="gk_goal_kicks"]')).text(),
          PorcentajeSaquesDePuertaLargos: $(element)
            .find($('[data-stat="gk_pct_goal_kicks_launched"]'))
            .text(),
          LongitudMediaDelSaque: $(element).find($('[data-stat="gk_goal_kick_length_avg"]')).text()
        },
        PasesCruzados: {
          CrucesSuperados: $(element).find($('[data-stat="gk_crosses"]')).text(),
          CrucesDetenidos: $(element).find($('[data-stat="gk_crosses_stopped"]')).text(),
          PorcentajeCrucesDetenidos: $(element).find($('[data-stat="gk_crosses_stopped_pct"]')).text()
        },
        Barredora: {
          DefensaFueraDelArea: $(element).find($('[data-stat="gk_def_actions_outside_pen_area"]')).text(),
          DistanciaPromediaDesdeLaPorteria: $(element)
            .find($('[data-stat="gk_avg_distance_def_actions"]'))
            .text()
        }
      })
    })
  return { LocalTeamPlayersData, LocalTeamPorterosData }
}

// FUnciones de la funcion MatchDetails

async function GetTeamImage($: cheerio.Root, element: string) {
  const GetLocalTeamCode =
    $(`#content > div.scorebox > div:nth-child(${element}) > div:nth-child(1) > div > span`)
      .attr('class')
      ?.split(' ')[1] !== undefined
      ? $(`#content > div.scorebox > div:nth-child(${element}) > div:nth-child(1) > div > span`)
          .attr('class')
          ?.split(' ')[1]
          .split('-')[1]
          .toUpperCase()
      : $(`#content > div.scorebox > div:nth-child(${element}) > div:nth-child(1) > div > span`)
          .attr('style')
          ?.split(';')[0]
          .split('/')[6]
          .split('-')[0]
          .toUpperCase()

  const LocalTeamImage =
    $(`#content > div.scorebox > div:nth-child(${element}) > div:nth-child(1) > div > img`).attr('src') !==
    undefined
      ? await GetTeamsIcons(
          $(`#content > div.scorebox > div:nth-child(${element}) > div:nth-child(1) > div > img`).attr('src')
        )
      : await GetTeamsIcons(`https://flagsapi.com/${GetLocalTeamCode}/flat/64.png`)
  return LocalTeamImage
}

function GetCaptainAndManager($: cheerio.Root, elemento: string) {
  const data: string[] = []
  $(elemento)
    .children('.datapoint')
    .each((index, elemento) => {
      data.push($(elemento).text().split(':')[1].trim())
    })
  return data
}

function GetLineUp($: cheerio.Root, htmlElement: string): LineUp[] {
  const Alineacion: LineUp[] = []
  $(htmlElement)
    .children('tr')
    .each((index, elemento) => {
      if (index > 0 && index !== 12) {
        const data: LineUp = {
          Number: Number($(elemento).children('td').first().text()),
          PlayerName: $(elemento).children('td').last().text(),
          PlayerId: $(elemento).children('td').last().children('a').attr('href')?.split('/')[3],
          titular: index < 12 ? true : false
        }
        Alineacion.push(data)
      }
    })
  return Alineacion
}
