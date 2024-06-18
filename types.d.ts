/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MatchInformation {
  Liga: string
  Año: string
  Pais: string
  Genero: string
  Ronda: string
  Jornada: number | string
  Dia: string
  Fecha: string
  Hora: string
  EquipoLocal: string | null
  EquipoLocalId: string | undefined
  EquipoLocalXG: number
  EquipoLocalPenaltis: number
  EquipoLocalGoles: number
  EquipoVisitanteGoles: number
  EquipoVisitanteXG: number
  EquipoVisitante: string
  EquipoVisitanteId: string | undefined
  Asistencia: string
  Estadio: string
  Arbitro: string
  MatchId: string
  LeagueId: string
  MatchDetails: string
  EquipoVisitantePenaltis: number
  _id?: any
}

export interface LeagueInformation {
  _id?: any
  Pais: string
  LeagueImage: string | undefined
  Liga: string
  LeagueId: string
  Año: string
  Campeon: {
    TeamName: string
    TeamId: string | undefined
  }
  MaximoGoleador: MaximoGoleador[]
  MaximoAsistente: MaximoAsistente[]
  MaxPorteriasACero: MaxPorteriasACero[]
}

export interface MaximoGoleador {
  Nombre: string
  Equipo: string
  Goles: string
  PlayerId: string
}

export interface MaximoAsistente {
  Nombre: string
  Equipo: string
  Asistencias: string
  PlayerId: string
}

export interface MaxPorteriasACero {
  Nombre: string
  Equipo: string
  PorteriasACero: string
  PlayerId: string
}
