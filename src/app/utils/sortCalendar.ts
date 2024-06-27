import { saveDatabase } from '../../../types'

export const SortCalendar = (calendar: saveDatabase[]) => {
  const CalendarAndDates = calendar?.map((element) => [
    element.Partidos.length.toString(),
    element.DateElement
  ])
  CalendarAndDates.sort((a: string[], b: string[]) => {
    return new Date(a[1]).getTime() - new Date(b[1]).getTime()
  })
  return CalendarAndDates
}
