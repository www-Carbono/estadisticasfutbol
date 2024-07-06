import './loader.css'
export const Loader = () => {
  return (
    <div className='flex justify-center items-center text-white'>
      <div className='dot-spinner'>
        <div className='dot-spinner__dot'></div>
        <div className='dot-spinner__dot'></div>
        <div className='dot-spinner__dot'></div>
        <div className='dot-spinner__dot'></div>
        <div className='dot-spinner__dot'></div>
        <div className='dot-spinner__dot'></div>
        <div className='dot-spinner__dot'></div>
        <div className='dot-spinner__dot'></div>
      </div>
    </div>
  )
}
