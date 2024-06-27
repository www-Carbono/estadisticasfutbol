import { Calendar } from './components/Calendar/calendar'
import { NavBar } from './components/NavBar'
import { HeaderTop } from './components/HeaderTop'
import { Blog } from './components/Blog'
export default function Home() {
  return (
    <div className='flex bg-zinc-900 text-white p-10'>
      <NavBar />

      <div className='flex-1 p-4 py-0 space-y-4'>
        <HeaderTop />
        <Calendar />
      </div>
      <Blog />
    </div>
  )
}
