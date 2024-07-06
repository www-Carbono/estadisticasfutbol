import { NextIcon } from './Icons'

interface Props {
  calendarDates: (number | string)[][]
  handlePrev: () => void
  handleNext: () => void
  renderDates: () => JSX.Element[]
  currentIndex: number
}

export const DatesCarousel: React.FC<Props> = ({
  calendarDates,
  handlePrev,
  handleNext,
  renderDates,
  currentIndex
}) => {
  return (
    <div className='carousel'>
      {calendarDates && (
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
            disabled={renderDates().length < 6 && currentIndex > 27}
            className={renderDates().length < 6 && currentIndex > 27 ? '' : 'btn-content'}
          >
            <NextIcon color={renderDates().length < 6 && currentIndex > 27 ? '#aaa' : '#c3cc5a'} />
          </button>
        </div>
      )}
    </div>
  )
}
