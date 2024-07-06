import { useState, useEffect } from 'react'
import { saveDatabase } from '../../../types'
import { GetCurrentDate } from '../utils/GetCurrentDate'
import { GetCalendarDates, GetCalendarService } from '../services/Calendar'
import { SortCalendar } from '../utils/sortCalendar'
import { ChangeEvent } from 'react'
import { DayConverter } from '../utils/DayConverter'
import { CalendarMatches } from '../../../types'
// import { UseLoading } from '../providers/LoaderProvider'

export const useSelectedMatches = () => {
  const [calendarDates, setCalendarDates] = useState<(string | number)[][]>([])

  const [calendar, setCalendar] = useState<saveDatabase>()
  const [DataSelected, setDataSelected] = useState<string>(GetCurrentDate())
  const [filter, setFilter] = useState({
    selectedTypeGame: '',
    search: ''
  })

  const [isCalendarLoaded, setIsCalendarLoaded] = useState(false)
  const [isMatchesLoaded, setIsMatchesLoaded] = useState(false)

  // DatesCarrousel
  const [currentIndex, setCurrentIndex] = useState<number>(18)
  const [selected, setSelected] = useState<number>()
  const fechaFormateada = GetCurrentDate()

  //Tercer file
  const [Matches, setMatches] = useState<CalendarMatches[][]>()
  const [matchesFilter, setMatchesFilter] = useState<CalendarMatches[]>([])
  const [matchesFilterOrderer, setMatchesFilterOrderer] = useState<CalendarMatches[][]>([])

  const FetchCalendar = async () => {
    const CalendarDates = await GetCalendarDates()
    const data = await GetCalendarService(DataSelected)
    setCalendarDates(SortCalendar(CalendarDates.response))
    setCalendar(data.response)
    setIsCalendarLoaded(true)
    setIsMatchesLoaded(true)
  }
  useEffect(() => {
    FetchCalendar()
  }, [])

  useEffect(() => {
    setIsMatchesLoaded(false)
    const Fetch = async () => {
      console.log(DataSelected)
      const data = await GetCalendarService(DataSelected)
      setCalendar(data.response)
      setIsMatchesLoaded(true)
    }
    Fetch()
  }, [DataSelected])

  const onChangeForm = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { name, value } = event.target
    setFilter({
      ...filter,
      [name]: value
    })
  }

  useEffect(() => {
    if (calendar !== undefined) {
      const DataFiltered = calendar.Partidos.filter((Match) => {
        if (filter.selectedTypeGame === '') {
          if (Match.Local.includes(filter.search)) {
            return true
          }
          if (Match.Visitante.includes(filter.search)) {
            return true
          }
        }

        if (filter.selectedTypeGame === 'No Empezado') {
          if (Match.Local.includes(filter.search) && Match.EstadoDelPartido === filter.selectedTypeGame) {
            return true
          }
          if (Match.Visitante.includes(filter.search) && Match.EstadoDelPartido === filter.selectedTypeGame) {
            return true
          }
        }

        if (filter.selectedTypeGame === 'Finalizado') {
          if (Match.Local.includes(filter.search) && Match.EstadoDelPartido === filter.selectedTypeGame) {
            return true
          }
          if (Match.Visitante.includes(filter.search) && Match.EstadoDelPartido === filter.selectedTypeGame) {
            return true
          }
        }
      })
      setMatchesFilter(DataFiltered)
    }
  }, [filter, calendar, DataSelected, Matches])

  useEffect(() => {
    const matchesFilterOrderer: { [key: string]: CalendarMatches[] } = {}
    if (matchesFilter.length > 0) {
      matchesFilter.map((match) => {
        if (!matchesFilterOrderer[match.LeagueId as string]) {
          matchesFilterOrderer[match.LeagueId as string] = []
        }
        matchesFilterOrderer[match.LeagueId as string].push(match)
      })
      // // const test = Object.values(matchesFilterOrderer)[0]
      setMatchesFilterOrderer(Object.values(matchesFilterOrderer))
    } else {
      setMatchesFilterOrderer([])
    }
  }, [matchesFilter])

  useEffect(() => {
    if (calendarDates !== undefined && calendarDates.length > 0) {
      const index = calendarDates.findIndex((subArray) => subArray.indexOf(fechaFormateada) !== -1)
      setSelected(index)
      setCurrentIndex(index)
    }
  }, [calendarDates, fechaFormateada])

  const onClickButton = (i: number, event: React.MouseEvent<HTMLElement>) => {
    // setIsCalendarLoaded(false)
    setSelected(i)
    const fecha: string = event.currentTarget.getAttribute('datatype') ?? ''
    setDataSelected(fecha)
  }

  const renderDates = () => {
    const items = []
    const Fechas = calendarDates.map((element) => element[0])
    const CantidadElementos = calendarDates.map((elemento) => elemento[1])
    for (let i = currentIndex - 2; i <= currentIndex + 2; i++) {
      if (i >= 0 && i < Fechas.length) {
        items.push(
          <button
            key={i}
            className={`carousel-item bg-zinc-700 text-white px-4 m-2  rounded-md font-bold dateSelector relative animationSelector ${
              selected === i ? 'selected' : ''
            }`}
            datatype={Fechas[i] as string}
            onClick={(event) => onClickButton(i, event)}
          >
            <p>{DayConverter(new Date(Fechas[i]).getDay())}</p>
            <p>{(Fechas[i] as string).substring(5)}</p>
            <p className='absolute bottom-0 right-0 -mx-2 -my-2 border-red-600 bg-red-500 rounded-full p-1 text-white text-xs'>
              {CantidadElementos[i]}
            </p>
          </button>
        )
      }
    }
    return items
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < calendarDates.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  useEffect(() => {
    if (calendar) {
      const Ligas: string[] = []
      calendar.Partidos.map((elemento) => Ligas.push(elemento.LeagueId as string))

      const groupedGames: { [key: string]: CalendarMatches[] } = {}
      calendar.Partidos.forEach((match) => {
        const leagueId: string | undefined = match?.LeagueId

        if (!groupedGames[leagueId as string]) {
          groupedGames[match.LeagueId as string] = []
        }
        groupedGames[match.LeagueId as string].push(match)
      })
      setMatches(Object.values(groupedGames))
    }
  }, [calendar, DataSelected])

  return {
    calendar,
    onChangeForm,
    filter,
    calendarDates,
    setDataSelected,
    DataSelected,
    renderDates,
    handlePrev,
    handleNext,
    currentIndex,
    matchesFilterOrderer,
    isCalendarLoaded,
    isMatchesLoaded
  }
}
