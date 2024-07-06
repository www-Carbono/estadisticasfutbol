'use server'

import { saveDatabase } from '../../../types'

export const GetCalendarService = async (date: string) => {
  const request = await fetch(`http://localhost:3000/api/calendario/${date}`)
  const data = await request.json()
  return data
}

export const AddCalendarData = async (remove: boolean, dataToSave: saveDatabase[]) => {
  const LINK = `${process.env.API_DOMAIN}/api/calendario`
  const response = await fetch(LINK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      remove,
      dataToSave
    })
  })
  const data = await response.json()
  return data.Equipos
}

export const GetCalendarDates = async () => {
  const request = await fetch(`http://localhost:3000/api/calendario/dates`)
  const data = await request.json()
  return data
}
