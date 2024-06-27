'use client'
import { ChangeEvent } from 'react'
import { DatesCarousel } from './DatesCarousel'
import { LeagueCalendar } from './LeagueCalendar'
import { useSelectedMatches } from '@/app/hooks/useSelectedMatches'

export const Calendar = () => {
  const {
    calendar,
    onChangeForm,
    filter,
    Matches,
    calendarDays,
    handlePrev,
    handleNext,
    renderDates,
    currentIndex,
    matchesFilter
  } = useSelectedMatches()

  return (
    <>
      {calendar && (
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
              <option value='Sin Comenzar'>Sin Empezar</option>
            </select>
            <input
              type='text'
              className='bg-zinc-700 text-white p-2 rounded-md flex-grow'
              placeholder='Search For Matches'
              name='search'
            />
            <select
              className='bg-zinc-700 text-white p-2 rounded-md'
              name='selectTeamOrGame'
            >
              <option value='Equipo'>Buscar Equipo</option>
              <option value='Liga'>Buscar Liga</option>
            </select>
          </form>
          <div className='flex space-x-2'>
            {
              <DatesCarousel
                handleNext={handleNext}
                handlePrev={handlePrev}
                calendarDays={calendarDays}
                renderDates={renderDates}
                currentIndex={currentIndex}
              />
            }
          </div>
          <LeagueCalendar
            Matches={Matches}
            MatchesFilter={matchesFilter}
          />
        </div>
      )}
    </>
  )
}
