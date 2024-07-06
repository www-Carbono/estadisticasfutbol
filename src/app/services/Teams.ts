import { Team } from '../../../types'

export const GetTeamService = async (id: string) => {
  const LINK = `${process.env.API_DOMAIN}/api/equipos/${id}`
  const response = await fetch(LINK, { method: 'GET' })
  const data = await response.json()
  return data.Equipos
}

export const AddTeamService = async (TeamData: Team[]) => {
  const LINK = `${process.env.API_DOMAIN}/api/equipos`
  const response = await fetch(LINK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: {
        TeamName: TeamData[0].TeamName,
        TeamId: TeamData[0].TeamId,
        TeamImage: TeamData[0].TeamImage
      }
    })
  })
  const data = await response.json()
  return data.response
}
