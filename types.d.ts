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
  Genero: string
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

export interface LineUp {
  Number: number
  PlayerName: string
  PlayerId: string | undefined
  titular: boolean
}

export interface GameEvents {
  Evento: string | undefined
  Jugador: string
  JugadorId: string | undefined
  Minuto: string
  Info: string | null
}

export interface Stats {
  PorcentajeLocal?: string | null
  PorcentajeAway?: string | null
  CompletadosLocal?: string | null
  TotalesLocal?: string | null
  CompletadosVisitante?: string | null
  TotalesVisitante?: string | null
}

export interface CardDetails {
  LocalAmarillas?: number
  LocalRojas?: number
  VisitanteAmarillas?: number
  VisitanteRojas?: number
}

export interface Stats {
  [key: string]: StatDetails | CardDetails
}

export interface StatDetail {
  Local: string
  Visitante: string
}

export interface StatsDetailsF {
  [key: string]: StatDetail
}

export interface TeamPlayerData {
  Player: string
  PlayerId: string | undefined
  PlayerNumber: string
  Pais?: string
  PaisId?: string
  Position: string
  Edad: string
  MinutosJugados: string
  Rendimiento: {
    Goles: string
    Asistencias: string
    PenaltiEjecutado: string
    TotalPenaltisTirados: string
    Tiros: string
    TirosAPuerta: string
    TarjetasAmarillas: string
    TarjetasRojas: string
    Toques: string
    Entradas: string
    Intercepciones: string
    Bloqueos: string
  }
  Expectativas: {
    xG: string
    xGNoPenaltis: string
  }
  ACT: {
    AccionesCreacionDeTiros: string
    AccionesCreacionDeGoles: string
  }
  Pases: {
    PasesCompletados: string
    TotalPasesIntentados: string
    PorcentajePaseCompletado: string
    PasesProgresivos: string
  }
  Transportes: {
    ControlesDeBalon: string
    ControlesDeBalonProgresivo: string
  }
  Regates: {
    RegatesIntentados: string
    RegatesConseguidosConExito: string
  }
}

export interface TeamPorteroData {
  PlayerName: string
  PlayerId: string | undefined
  ParadasATiros: {
    DisparosAPuertaEnContra: string
    GolesEnContra: string
    Paradas: string
    PorcentajeDeSalvadas: string
    GolesEsperadosPosteriorAlTiro: string
  }
  PasesIniciados: {
    PasesCompletadosIniciados: string
    PasesIntentadosCompletados: string
    PorcentajePasesIniciadosCompletados: string
  }
  Pases: {
    PasesIntentados: string
    TirosIntentados: string
    PorcentajeDePasesRealizados: string
    LongitudMediaDelPase: string
  }
  SaquesDePuerta: {
    SaquesDePuerta: string
    PorcentajeSaquesDePuertaLargos: string
    LongitudMediaDelSaque: string
  }
  PasesCruzados: {
    CrucesSuperados: string
    CrucesDetenidos: string
    PorcentajeCrucesDetenidos: string
  }
  Barredora: {
    DefensaFueraDelArea: string
    DistanciaPromediaDesdeLaPorteria: string
  }
}

export interface CalendarMatches {
  DateElements?: string
  LeagueName: string
  LeagueId: string | undefined
  Ronda: string
  Jornada: string
  Hora: string
  Local: string
  LocalTeamId: string | undefined
  LocalXG: string
  GolesLocal: number | null
  GolesVisitante: number | null
  VisitanteXG: string
  Visitante: string
  VisitanteTeamId: string | undefined
  Asistencia: string
  Estadio: string
  Arbitro: string
  EstadoDelPartido: string
}

export interface saveDatabase {
  DateElement: string
  Partidos: CalendarMatches[]
}
