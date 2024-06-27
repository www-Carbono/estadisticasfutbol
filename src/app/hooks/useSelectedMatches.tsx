import { useState, useEffect } from 'react'
import { saveDatabase } from '../../../types'
import { GetCurrentDate } from '../utils/GetCurrentDate'
import { GetCalendarService } from '../services/GetCalendarService'
import { SortCalendar } from '../utils/sortCalendar'
import { ChangeEvent } from 'react'
import { DayConverter } from '../utils/DayConverter'
import { CalendarMatches } from '../../../types'

export const useSelectedMatches = () => {
  const [calendar, setCalendar] = useState<saveDatabase[]>()
  const [calendarDays, setCalendarDays] = useState<string[][]>([])
  const [DataSelected, setDataSelected] = useState<string>(GetCurrentDate())
  const [filter, setFilter] = useState({
    selectedTypeGame: '',
    search: '',
    selectTeamOrGame: ''
  })

  // DatesCarrousel
  const [currentIndex, setCurrentIndex] = useState<number>(18)
  const [selected, setSelected] = useState<number>()
  const fechaFormateada = GetCurrentDate()

  //Tercer file
  const [Matches, setMatches] = useState<CalendarMatches[][]>()
  const [matchesFilter, setMatchesFilter] = useState<CalendarMatches[]>([])

  const FetchCalendar = async () => {
    const data = await GetCalendarService()
    setCalendar(data.response)
  }
  useEffect(() => {
    FetchCalendar()
  }, [])

  useEffect(() => {
    if (calendar !== undefined && calendar?.length > 0) {
      const CalendarAndDates = SortCalendar(calendar)
      setCalendarDays(CalendarAndDates as string[][])
    }
  }, [calendar])

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
      const FilterData = calendar.filter((element: saveDatabase) => element.DateElement === DataSelected)[0]
      const DataFiltered = FilterData.Partidos.filter((Match) => Match.Local.includes(filter.search))
      setMatchesFilter(DataFiltered)
    }
  }, [filter, calendar, DataSelected])

  useEffect(() => {
    if (calendarDays !== undefined && calendarDays.length > 0) {
      const index = calendarDays.findIndex((subArray) => subArray.indexOf(fechaFormateada) !== -1)
      setSelected(index)
      setCurrentIndex(index)
    }
  }, [calendarDays, fechaFormateada])

  const onClickButton = (i: number, event: React.MouseEvent<HTMLElement>) => {
    setSelected(i)
    const fecha: string = event.currentTarget.getAttribute('datatype') ?? ''
    setDataSelected(fecha)
  }

  const renderDates = () => {
    const items = []
    const Fechas = calendarDays.map((element) => element[1])
    const CantidadElementos = calendarDays.map((elemento) => elemento[0])
    for (let i = currentIndex - 2; i <= currentIndex + 2; i++) {
      if (i >= 0 && i < Fechas.length) {
        items.push(
          <button
            key={i}
            className={`carousel-item bg-zinc-700 text-white px-4 m-2  rounded-md font-bold dateSelector relative animationSelector ${
              selected === i ? 'selected' : ''
            }`}
            datatype={Fechas[i]}
            onClick={(event) => onClickButton(i, event)}
          >
            <p>{DayConverter(new Date(Fechas[i]).getDay())}</p>
            <p>{Fechas[i].substring(5)}</p>
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
    if (currentIndex < calendarDays.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  useEffect(() => {
    if (calendar) {
      const FilterData = calendar.filter((element: saveDatabase) => element.DateElement === DataSelected)[0]

      const Ligas: string[] = []
      FilterData.Partidos.map((elemento) => Ligas.push(elemento.LeagueId as string))

      const groupedGames: { [key: string]: CalendarMatches[] } = {}
      FilterData.Partidos.forEach((match) => {
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
    calendarDays,
    setDataSelected,
    DataSelected,
    renderDates,
    handlePrev,
    handleNext,
    currentIndex,
    Matches,
    matchesFilter
  }
}
