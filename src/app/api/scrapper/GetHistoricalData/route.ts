import { headers } from 'next/headers'
import {
  MatchInformation,
  LeagueInformation,
  MaximoGoleador,
  MaximoAsistente,
  MaxPorteriasACero
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
      'https://fbref.com/es/comps/9/horario/Resultados-y-partidos-en-Premier-League',
      'https://fbref.com/es/comps/9/2022-2023/horario/Marcadores-y-partidos-de-2022-2023-Premier-League',
      'https://fbref.com/es/comps/9/2021-2022/horario/Marcadores-y-partidos-de-2021-2022-Premier-League',
      'https://fbref.com/es/comps/9/2020-2021/horario/Marcadores-y-partidos-de-2020-2021-Premier-League',
      'https://fbref.com/es/comps/9/2019-2020/horario/Marcadores-y-partidos-de-2019-2020-Premier-League',
      'https://fbref.com/es/comps/9/2018-2019/horario/Marcadores-y-partidos-de-2018-2019-Premier-League',
      'https://fbref.com/es/comps/9/2017-2018/horario/Marcadores-y-partidos-de-2017-2018-Premier-League',
      'https://fbref.com/es/comps/9/2016-2017/horario/Marcadores-y-partidos-de-2016-2017-Premier-League',
      'https://fbref.com/es/comps/9/2015-2016/horario/Marcadores-y-partidos-de-2015-2016-Premier-League',
      'https://fbref.com/es/comps/9/2014-2015/horario/Marcadores-y-partidos-de-2014-2015-Premier-League',
      'https://fbref.com/es/comps/9/2013-2014/horario/Marcadores-y-partidos-de-2013-2014-Premier-League',
      'https://fbref.com/es/comps/9/2012-2013/horario/Marcadores-y-partidos-de-2012-2013-Premier-League',
      'https://fbref.com/es/comps/9/2011-2012/horario/Marcadores-y-partidos-de-2011-2012-Premier-League',
      'https://fbref.com/es/comps/9/2010-2011/horario/Marcadores-y-partidos-de-2010-2011-Premier-League',
      'https://fbref.com/es/comps/9/2009-2010/horario/Marcadores-y-partidos-de-2009-2010-Premier-League',
      'https://fbref.com/es/comps/9/2008-2009/horario/Marcadores-y-partidos-de-2008-2009-Premier-League',
      'https://fbref.com/es/comps/9/2007-2008/horario/Marcadores-y-partidos-de-2007-2008-Premier-League',
      'https://fbref.com/es/comps/9/2006-2007/horario/Marcadores-y-partidos-de-2006-2007-Premier-League',
      'https://fbref.com/es/comps/9/2005-2006/horario/Marcadores-y-partidos-de-2005-2006-Premier-League',
      'https://fbref.com/es/comps/9/2004-2005/horario/Marcadores-y-partidos-de-2004-2005-Premier-League',
      'https://fbref.com/es/comps/9/2003-2004/horario/Marcadores-y-partidos-de-2003-2004-Premier-League',
      'https://fbref.com/es/comps/9/2002-2003/horario/Marcadores-y-partidos-de-2002-2003-Premier-League',
      'https://fbref.com/es/comps/9/2001-2002/horario/Marcadores-y-partidos-de-2001-2002-Premier-League',
      'https://fbref.com/es/comps/9/2000-2001/horario/Marcadores-y-partidos-de-2000-2001-Premier-League',
      'https://fbref.com/es/comps/9/1999-2000/horario/Marcadores-y-partidos-de-1999-2000-Premier-League',
      'https://fbref.com/es/comps/9/1998-1999/horario/Marcadores-y-partidos-de-1998-1999-Premier-League',
      'https://fbref.com/es/comps/9/1997-1998/horario/Marcadores-y-partidos-de-1997-1998-Premier-League',
      'https://fbref.com/es/comps/9/1996-1997/horario/Marcadores-y-partidos-de-1996-1997-Premier-League',
      'https://fbref.com/es/comps/9/1995-1996/horario/Marcadores-y-partidos-de-1995-1996-Premier-League',
      'https://fbref.com/es/comps/9/1994-1995/horario/Marcadores-y-partidos-de-1994-1995-Premier-League',
      'https://fbref.com/es/comps/9/1993-1994/horario/Marcadores-y-partidos-de-1993-1994-Premier-League',
      'https://fbref.com/es/comps/9/1992-1993/horario/Marcadores-y-partidos-de-1992-1993-Premier-League',
      'https://fbref.com/es/comps/9/1991-1992/horario/Marcadores-y-partidos-de-1991-1992-Premier-League',
      'https://fbref.com/es/comps/9/1990-1991/horario/Marcadores-y-partidos-de-1990-1991-Premier-League',
      'https://fbref.com/es/comps/9/1989-1990/horario/Marcadores-y-partidos-de-1989-1990-Premier-League',
      'https://fbref.com/es/comps/9/1988-1989/horario/Marcadores-y-partidos-de-1988-1989-Premier-League',
      'https://fbref.com/es/comps/9/1987-1988/horario/Marcadores-y-partidos-de-1987-1988-Premier-League',
      'https://fbref.com/es/comps/9/1986-1987/horario/Marcadores-y-partidos-de-1986-1987-Premier-League',
      'https://fbref.com/es/comps/9/1985-1986/horario/Marcadores-y-partidos-de-1985-1986-Premier-League',
      'https://fbref.com/es/comps/9/1984-1985/horario/Marcadores-y-partidos-de-1984-1985-Premier-League',
      'https://fbref.com/es/comps/9/1983-1984/horario/Marcadores-y-partidos-de-1983-1984-Premier-League',
      'https://fbref.com/es/comps/9/1982-1983/horario/Marcadores-y-partidos-de-1982-1983-Premier-League',
      'https://fbref.com/es/comps/9/1981-1982/horario/Marcadores-y-partidos-de-1981-1982-Premier-League',
      'https://fbref.com/es/comps/9/1980-1981/horario/Marcadores-y-partidos-de-1980-1981-Premier-League',
      'https://fbref.com/es/comps/9/1979-1980/horario/Marcadores-y-partidos-de-1979-1980-Premier-League',
      'https://fbref.com/es/comps/9/1978-1979/horario/Marcadores-y-partidos-de-1978-1979-Premier-League',
      'https://fbref.com/es/comps/9/1977-1978/horario/Marcadores-y-partidos-de-1977-1978-Premier-League',
      'https://fbref.com/es/comps/9/1976-1977/horario/Marcadores-y-partidos-de-1976-1977-Premier-League',
      'https://fbref.com/es/comps/9/1975-1976/horario/Marcadores-y-partidos-de-1975-1976-Premier-League',
      'https://fbref.com/es/comps/9/1974-1975/horario/Marcadores-y-partidos-de-1974-1975-Premier-League',
      'https://fbref.com/es/comps/9/1973-1974/horario/Marcadores-y-partidos-de-1973-1974-Premier-League',
      'https://fbref.com/es/comps/9/1972-1973/horario/Marcadores-y-partidos-de-1972-1973-Premier-League',
      'https://fbref.com/es/comps/9/1971-1972/horario/Marcadores-y-partidos-de-1971-1972-Premier-League',
      'https://fbref.com/es/comps/9/1970-1971/horario/Marcadores-y-partidos-de-1970-1971-Premier-League',
      'https://fbref.com/es/comps/9/1969-1970/horario/Marcadores-y-partidos-de-1969-1970-Premier-League',
      'https://fbref.com/es/comps/9/1968-1969/horario/Marcadores-y-partidos-de-1968-1969-Premier-League',
      'https://fbref.com/es/comps/9/1967-1968/horario/Marcadores-y-partidos-de-1967-1968-Premier-League',
      'https://fbref.com/es/comps/9/1966-1967/horario/Marcadores-y-partidos-de-1966-1967-Premier-League',
      'https://fbref.com/es/comps/9/1965-1966/horario/Marcadores-y-partidos-de-1965-1966-Premier-League',
      'https://fbref.com/es/comps/9/1964-1965/horario/Marcadores-y-partidos-de-1964-1965-Premier-League',
      'https://fbref.com/es/comps/9/1963-1964/horario/Marcadores-y-partidos-de-1963-1964-Premier-League',
      'https://fbref.com/es/comps/9/1962-1963/horario/Marcadores-y-partidos-de-1962-1963-Premier-League',
      'https://fbref.com/es/comps/9/1961-1962/horario/Marcadores-y-partidos-de-1961-1962-Premier-League',
      'https://fbref.com/es/comps/9/1960-1961/horario/Marcadores-y-partidos-de-1960-1961-Premier-League',
      'https://fbref.com/es/comps/9/1959-1960/horario/Marcadores-y-partidos-de-1959-1960-Premier-League',
      'https://fbref.com/es/comps/9/1958-1959/horario/Marcadores-y-partidos-de-1958-1959-Premier-League',
      'https://fbref.com/es/comps/9/1957-1958/horario/Marcadores-y-partidos-de-1957-1958-Premier-League',
      'https://fbref.com/es/comps/9/1956-1957/horario/Marcadores-y-partidos-de-1956-1957-Premier-League',
      'https://fbref.com/es/comps/9/1955-1956/horario/Marcadores-y-partidos-de-1955-1956-Premier-League',
      'https://fbref.com/es/comps/9/1954-1955/horario/Marcadores-y-partidos-de-1954-1955-Premier-League',
      'https://fbref.com/es/comps/9/1953-1954/horario/Marcadores-y-partidos-de-1953-1954-Premier-League',
      'https://fbref.com/es/comps/9/1952-1953/horario/Marcadores-y-partidos-de-1952-1953-Premier-League',
      'https://fbref.com/es/comps/9/1951-1952/horario/Marcadores-y-partidos-de-1951-1952-Premier-League',
      'https://fbref.com/es/comps/9/1950-1951/horario/Marcadores-y-partidos-de-1950-1951-Premier-League',
      'https://fbref.com/es/comps/9/1949-1950/horario/Marcadores-y-partidos-de-1949-1950-Premier-League',
      'https://fbref.com/es/comps/9/1948-1949/horario/Marcadores-y-partidos-de-1948-1949-Premier-League',
      'https://fbref.com/es/comps/9/1947-1948/horario/Marcadores-y-partidos-de-1947-1948-Premier-League',
      'https://fbref.com/es/comps/9/1946-1947/horario/Marcadores-y-partidos-de-1946-1947-Premier-League'
    ]
    for (const link of URL) {
      const data = await Scrape(link)
      const cleanData = await CheckIfMatchExists(data, 'Matches')
      await SaveData(cleanData as MatchInformation[], 'Matches')
      await MatchesDetails(cleanData as MatchInformation[])
    }
    return Response.json({
      message: 'Datos Añadidos Correctamente a la base de Datos'
    })
  }

  const data = await Scrape(URL)
  const cleanData = await CheckIfMatchExists(data, 'Matches')
  if (cleanData.length > 0) {
    // await SaveData(cleanData as MatchInformation[], 'Matches')
    await MatchesDetails(cleanData as MatchInformation[])
    return Response.json({ message: cleanData })
  }

  return Response.json({ message: 'No hay Datos Para Actualizar' })
}

const Scrape = async (URL: string): Promise<MatchInformation[]> => {
  const RequestToScrape = await fetch(URL)
  const RequestToText = await RequestToScrape.text()
  const $ = cheerio.load(RequestToText)
  const Pais = $('#meta > div:nth-child(2) > p:nth-child(3) > a').text()
  const Genero =
    $('#meta > div:nth-child(2) > p:nth-child(5)')
      .text()
      .trim()
      .split(' ')[0] === 'Género:'
      ? $('#meta > div:nth-child(2) > p:nth-child(5)').text().split(' ')[1]
      : $('#meta > div:nth-child(2) > p:nth-child(4)').text().split(' ')[1]

  const Liga = $('#meta > div:nth-child(2) > h1')
    .text()
    .split(' ')
    .slice(5)
    .join()
    .trim()
    .replace(',', ' ')
  const Año = $('#meta > div:nth-child(2) > h1').text().split(' ')[4]
  const LeagueImage = $('#meta > div.media-item.logo > img').attr('src')
  // Ahora Scrapeamos la tabla:
  const MatchTable = $('.stats_table:first')
  const MatchInformation: MatchInformation[] = []
  const LeagueId = URL.split('/')[5]

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
              console.log($(text).attr('href'))
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
              console.log($(text).attr('href'))
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
              console.log($(text).attr('href'))
              Playerid.push($(text).attr('href') as string)
            })

          VariosPorteriasACero.push({
            Nombre: element.split('(')[0].trim(),
            Equipo: element.split('(')[1].split(')')[0].trim(),
            PorteriasACero: dataStats[dataStats.length - 1]
              .split('-')[1]
              .trim(),
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
      LeagueId,
      Año,
      Campeon: {
        TeamName:
          $('#meta > div:nth-child(2) > p:nth-child(6) > strong').text() ===
          'Campeón'
            ? $('#meta > div:nth-child(2) > p:nth-child(6) > a').text()
            : $('#meta > div:nth-child(2) > p:nth-child(5) > a').text(),
        TeamId:
          $('#meta > div:nth-child(2) > p:nth-child(6) > strong').text() ===
          'Campeón'
            ? $('#meta > div:nth-child(2) > p:nth-child(6) > a')
                .attr('href')
                ?.split('/')[3]
            : $('#meta > div:nth-child(2) > p:nth-child(5) > a')
                .attr('href')
                ?.split('/')[3]
        // TeamId: $('#meta > div:nth-child(2) > p:nth-child(6) > a')
        // .attr('href')
        // ?.split('/')[3]
      },
      MaximoGoleador: VariosGoleadores,
      MaximoAsistente: VariosAsistentes,
      MaxPorteriasACero: VariosPorteriasACero
    }
  ]
  const cleanData = await CheckIfMatchExists(LeagueInfo, 'Leagues')
  if (cleanData.length > 0) {
    await SaveData(LeagueInfo[0], 'Leagues')
  }

  MatchTable.find('tr')
    .not('.partial_table')
    .each((i: number, row: Element) => {
      const Jornada =
        Number($(row).find($('[data-stat="gameweek"]')).text()) === Number('')
          ? $(row).find($('[data-stat="round"]')).text()
          : Number($(row).find($('[data-stat="gameweek"]')).text())

      const Ronda = $(row).find($('[data-stat="round"]')).text()

      const Dia = $(row).find($('[data-stat="dayofweek"]')).text()
      const Fecha = $(row).find($('[data-stat="date"]')).text()
      const Hora = $(row).find($('[data-stat="start_time"]')).text().trim()
      const EquipoLocal = $(row)
        .find($('[data-stat="home_team"]'))
        .children()
        .html()
      const EquipoLocalId = $(row)
        .find($('[data-stat="home_team"]'))
        .children()
        .attr('href')
        ?.split('/')[3]

      const EquipoLocalXG = Number(
        $(row).find($('[data-stat="home_xg"]')).text()
      )

      const EquipoLocalPenaltis = Number(
        $(row)
          .find($('[data-stat="score"]'))
          .children('small:last-child')
          .text()
          .split('')[1]
      )

      const Resultado = $(row)
        .find($('[data-stat="score"]'))
        .children('a')
        .text()
        .split('–')
      const EquipoLocalGoles = Number(Resultado[0])
      const EquipoVisitanteGoles = Number(Resultado[1])

      const EquipoVisitantePenaltis = Number(
        $(row)
          .find($('[data-stat="score"]'))
          .children('small:first-child')
          .text()
          .split('')[1]
      )

      const EquipoVisitanteXG = Number(
        $(row).find($('[data-stat="away_xg"]')).text()
      )
      const EquipoVisitante = $(row)
        .find($('[data-stat="away_team"]'))
        .children('a')
        .text()

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
    })
  return MatchInformation
}

const SaveData = async (
  dataToSave: MatchInformation[] | LeagueInformation,
  collectionName: string
) => {
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
      await client
        .db('EstadisticasFutbol')
        .collection(collectionName)
        .insertOne(dataToSave)
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
    const result = await client
      .db('EstadisticasFutbol')
      .collection(collection)
      .find()
      .toArray()

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
    console.log('error gettin db')
  }

  console.log(DataSinDuplicados)
  return DataSinDuplicados
}

const MatchesDetails = async (data: MatchInformation[]) => {
  const Details = []
  for (const element of data) {
    const URL = `${process.env.URL}${element.MatchDetails}`
    const RequestToScrape = await fetch(URL)
    const RequestToText = await RequestToScrape.text()
    const $ = cheerio.load(RequestToText)

    const GetLocalTeamCode = $(
      '#content > div.scorebox > div:nth-child(1) > div:nth-child(1) > div > span'
    )
      .attr('class')
      ?.split(' ')[1]
      .split('-')[1]
      .toUpperCase()

    const LocalTeamImage =
      $(
        '#content > div.scorebox > div:nth-child(1) > div:nth-child(1) > div > img'
      ).attr('src') !== undefined
        ? $(
            '#content > div.scorebox > div:nth-child(1) > div:nth-child(1) > div > img'
          ).attr('src')
        : `https://flagsapi.com/${GetLocalTeamCode}/flat/64.png`

    const GetAwayTeamCode = $(
      '#content > div.scorebox > div:nth-child(2) > div:nth-child(1) > div > span'
    )
      .attr('class')
      ?.split(' ')[1]
      .split('-')[1]
      .toUpperCase()

    const AwayTeamImage =
      $(
        '#content > div.scorebox > div:nth-child(2) > div:nth-child(1) > div > img'
      ).attr('src') !== undefined
        ? $(
            '#content > div.scorebox > div:nth-child(2) > div:nth-child(1) > div > img'
          ).attr('src')
        : `https://flagsapi.com/${GetAwayTeamCode}/flat/64.png`

    const LocalData: string[] = []
    const AwayData: string[] = []
    $('#content > div.scorebox > div:nth-child(1)')
      .children('.datapoint')
      .each((index, elemento) => {
        LocalData.push($(elemento).text().split(':')[1].trim())
      })

    $('#content > div.scorebox > div:nth-child(2)')
      .children('.datapoint')
      .each((index, elemento) => {
        AwayData.push($(elemento).text().split(':')[1].trim())
      })

    Details.push({
      ...element,
      LocalTeamImage,
      AwayTeamImage,
      DatosLocal: {
        Entrenador: LocalData[0],
        Capitan: LocalData[1]
      },
      DatosVisitante: {
        Entrenador: AwayData[0],
        Capitan: AwayData[1]
      }
    })
    break
  }
  console.log(Details)
}
