'use client'
import { ChangeEvent } from 'react'
import { DatesCarousel } from './DatesCarousel'
import { LeagueCalendar } from './LeagueCalendar'
import { useSelectedMatches } from '@/app/hooks/useSelectedMatches'
import { Loader } from '../utils/Loader'
import { useState } from 'react'
import { MatchPrevia } from '../MatchPrevia/MatchPrevia'
import { CalendarMatches } from '../../../../types'

export const Calendar = () => {
  const {
    onChangeForm,
    filter,
    calendarDates,
    handlePrev,
    handleNext,
    renderDates,
    currentIndex,
    matchesFilterOrderer,
    isCalendarLoaded,
    isMatchesLoaded
  } = useSelectedMatches()

  const [MatchSelected, setMatchSelected] = useState<CalendarMatches | null>(null)

  const ChangeMatchSelected = (data: CalendarMatches | null) => {
    setMatchSelected(data)
  }

  return (
    <>
      {isCalendarLoaded ? (
        <div>
          {MatchSelected === null ? (
            <div className='bg-zinc-800 rounded-lg p-4 space-y-4'>
              <form
                className='flex justify-between items-center gap-5'
                onChange={(event) => onChangeForm(event as ChangeEvent<HTMLFormElement>)}
                onSubmit={(evnt) => evnt.preventDefault()}
              >
                <select
                  className='bg-zinc-700 text-white p-2 rounded-md'
                  name='selectedTypeGame'
                  defaultValue={filter.selectedTypeGame}
                >
                  <option value=''>Todos los Partidos</option>
                  <option value='Finalizado'>Terminados</option>
                  <option value='No Empezado'>Sin Empezar</option>
                </select>
                <input
                  type='text'
                  className='bg-zinc-700 text-white p-2 rounded-md flex-grow'
                  placeholder='Search For Matches'
                  name='search'
                />
              </form>
              <div className='flex space-x-2'>
                {
                  <DatesCarousel
                    handleNext={handleNext}
                    handlePrev={handlePrev}
                    calendarDates={calendarDates}
                    renderDates={renderDates}
                    currentIndex={currentIndex}
                  />
                }
              </div>
              {isMatchesLoaded ? (
                <LeagueCalendar
                  MatchesFilter={matchesFilterOrderer}
                  ChangeMatchSelected={ChangeMatchSelected}
                />
              ) : (
                <Loader />
              )}
            </div>
          ) : (
            <MatchPrevia
              gameData={MatchSelected as CalendarMatches}
              backToMainMenu={ChangeMatchSelected}
            />
          )}
        </div>
      ) : (
        <Loader />
      )}
    </>
  )
}
