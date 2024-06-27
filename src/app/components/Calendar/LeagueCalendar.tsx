import { CalendarMatches } from '../../../../types'
import { GetRegion } from '@/app/utils/GetRegionName'
import Image from 'next/image'
interface Props {
  Matches: CalendarMatches[][] | undefined
  MatchesFilter: CalendarMatches[]
}

export const LeagueCalendar: React.FC<Props> = ({ Matches, MatchesFilter }) => {
  return (
    <div className='space-y-4'>
      {Matches &&
        Matches.map((Match: CalendarMatches[]) => (
          <div
            key={Match[0].LeagueId}
            className='mb-10 LeagueHeader rounded-b-xl rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-xl bg-black overflow-hidden'
          >
            <div className='bg-black rounded-xl rounded-b-none border border-t-0 border-l-0 border-r-0 flex items-center headerLeague font-bold gap-2 px-4 justify-between border-b-gray-400'>
              <div className='flex items-center gap-1'>
                <Image
                  src={`data:image/png;base64,${Match[0].LeagueIcon}`}
                  width={25}
                  height={25}
                  alt='PlaceHolder'
                />
                <p className='ml-2'>
                  {Match[0].LeagueRegion !== null && GetRegion(Match[0].LeagueRegion as string)}
                </p>
                <span className={Match[0].LeagueRegion !== null ? '' : 'hidden'}>-</span>
                <p>{Match[0].LeagueName}</p>
              </div>
              <p className='roundText font-bold'>
                (Jornada {Match[0].Jornada} - {Match[0].Ronda})
              </p>
            </div>

            <table className='min-w-full '>
              <thead className='bg-black text-white'>
                <tr>
                  <th className='px-4 py-1 text-center text-xs font-medium uppercase tracking-wider'>Hora</th>
                  <th className='px-28 py-1 text-left text-xs font-medium uppercase tracking-wider'>
                    Partido
                  </th>
                  <th className='px-4 py-1 text-center text-xs font-medium uppercase tracking-wider'>
                    Estadio
                  </th>
                  <th className='px-4 py-1 text-center text-xs font-medium uppercase tracking-wider'>
                    Árbitro
                  </th>
                  <th className='px-4 py-1 text-center text-xs font-medium uppercase tracking-wider'>
                    Información del Partido
                  </th>
                </tr>
              </thead>
              <tbody className=''>
                {Match.map((MatchInfo, index) => (
                  <tr
                    key={MatchInfo.LocalTeamId}
                    className={`h-14 p-4 last:border-b last:border-black ${
                      index % 2 === 1 ? 'bg-[#222222]' : 'bg-[#2C2C2C]'
                    }`}
                  >
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>{MatchInfo.Hora}</td>
                    <td className='px-2 py-4 whitespace-nowrap text-sm flex items-center w-96 max-w-96 min-w-96'>
                      <p className='flex w-24 text-right justify-end'>{MatchInfo.Local}</p>
                      <div className='flex justify-end'>
                        <Image
                          src={`data:image/png;base64,${MatchInfo.LocalTeamImage}`}
                          width={0}
                          height={0}
                          alt='Local Team Image'
                          className='mx-2'
                          style={{ width: '20px', height: '21px' }}
                        />
                      </div>
                      <span>-</span>
                      <div className='flex items-center'>
                        <Image
                          src={`data:image/png;base64,${MatchInfo.AwayTeamImage}`}
                          width={0}
                          height={0}
                          alt='Away Team Image'
                          className='mx-2 '
                          style={{ width: '20px', height: '21px' }}
                        />
                        <p className='flex w-28'>{MatchInfo.Visitante}</p>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm pl-0 w-56 max-w-56 min-w-56'>
                      {MatchInfo.Estadio}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm w-56 w-max-56 w-min-56'>
                      {MatchInfo.Arbitro.length > 0 ? MatchInfo.Arbitro : 'No Disponible'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm'>Más Información</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  )
}
