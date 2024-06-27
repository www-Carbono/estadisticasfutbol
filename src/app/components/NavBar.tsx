export const NavBar = () => {
  return (
    <div className='w-1/5 bg-zinc-800 p-4 flex flex-col justify-between rounded-md'>
      <div>
        <h1 className='text-2xl font-bold mb-6'>
          ESTADISTICAS<span className='text-yellow-500'>FUTBOL</span>
        </h1>
        <div className='relative mb-6'>
          <input
            type='text'
            className='w-full bg-zinc-700 text-white p-2 rounded-md pl-10'
            placeholder='Search'
          />
          <svg
            className='absolute left-3 top-3 w-5 h-5 text-zinc-400'
            fill='currentColor'
            viewBox='0 0 24 24'
          >
            <path d='M10 2a8 8 0 106.32 3.16l4.09 4.09a1 1 0 001.41-1.41l-4.09-4.09A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z' />
          </svg>
        </div>
        <nav className='space-y-4'>
          <a
            href='#'
            className='flex items-center space-x-2 text-yellow-500'
          >
            <svg
              className='w-5 h-5'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M3 12l2-2 4 4 8-8 2 2-10 10-6-6z' />
            </svg>
            <span>Home</span>
          </a>
          <a
            href='#'
            className='flex items-center space-x-2'
          >
            <svg
              className='w-5 h-5'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16z' />
            </svg>
            <span>Equipos</span>
          </a>
          <a
            href='#'
            className='flex items-center space-x-2'
          >
            <svg
              className='w-5 h-5'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16z' />
            </svg>
            <span>Jugadores</span>
          </a>
          <a
            href='#'
            className='flex items-center space-x-2'
          >
            <svg
              className='w-5 h-5'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16z' />
            </svg>
            <span>Arbitros</span>
          </a>
          <a
            href='#'
            className='flex items-center space-x-2'
          >
            <svg
              className='w-5 h-5'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16z' />
            </svg>
            <span>Buscador De Partidos</span>
          </a>
        </nav>
      </div>
      <div className='flex justify-between items-center'>
        <button className='bg-zinc-700 p-2 rounded-md'>Light</button>
        <button className='bg-zinc-700 p-2 rounded-md'>Dark</button>
      </div>
    </div>
  )
}
