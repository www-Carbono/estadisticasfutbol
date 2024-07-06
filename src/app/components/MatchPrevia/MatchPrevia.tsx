import { useEffect } from 'react'
import { CalendarMatches } from '../../../../types'

interface Props {
  gameData: CalendarMatches | null
  backToMainMenu: (date: CalendarMatches | null) => void
}
export const MatchPrevia: React.FC<Props> = ({ gameData, backToMainMenu }) => {
  useEffect(() => {
    console.log(gameData)
  })
  return (
    <div>
      <button onClick={() => backToMainMenu(null)}>Volver</button>
      <div>{JSON.stringify(gameData)}</div>
    </div>
  )
}
