import { NextIcon } from './Icons'

interface Props {
  calendarDays: string[][]
  handlePrev: () => void
  handleNext: () => void
  renderDates: () => JSX.Element[]
  currentIndex: number
}

export const DatesCarousel: React.FC<Props> = ({
  calendarDays,
  handlePrev,
  handleNext,
  renderDates,
  currentIndex
}) => {
  return (
    <div className='carousel'>
      {calendarDays && (
        <div className='carousel'>
          <button
            onClick={handlePrev}
            disabled={renderDates().length < 6 && currentIndex < 3}
            className={renderDates().length < 6 && currentIndex < 3 ? 'rotate-180' : 'btn-content rotate-180'}
          >
            <NextIcon color={renderDates().length < 6 && currentIndex < 3 ? '#aaa' : '#c3cc5a'} />
          </button>
          <div className='carousel-track-container'>
            <div className='carousel-track text-white px-4 py-2 rounded-md'>{renderDates()}</div>
          </div>

          <button
            onClick={handleNext}
            disabled={renderDates().length < 6 && currentIndex > 28}
            className={renderDates().length < 6 && currentIndex > 28 ? '' : 'btn-content'}
          >
            <NextIcon color={renderDates().length < 6 && currentIndex > 28 ? '#aaa' : '#c3cc5a'} />
          </button>
        </div>
      )}
    </div>
  )
}
