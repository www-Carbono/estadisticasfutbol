export const SortCalendar = (calendar: string[][]) => {
  calendar.sort((a: string[], b: string[]) => {
    return new Date(a[0]).getTime() - new Date(b[0]).getTime()
  })
  return calendar
}
