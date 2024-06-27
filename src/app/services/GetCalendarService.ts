'use server'
export const GetCalendarService = async () => {
  const request = await fetch(`${process.env.API_DOMAIN}/api/GetCalendar`, { method: 'POST' })
  const data = await request.json()
  return data
}
