'use client'
import { Calendar } from './components/Calendar/calendar'
import { NavBar } from './components/NavBar'
import { HeaderTop } from './components/HeaderTop'
import { Blog } from './components/Blog'
import { useSelectedMenu } from './hooks/useSelectedMenu'

export default function Home() {
  const { menuState, changeMenu } = useSelectedMenu()
  return (
    <div className='flex bg-zinc-900 text-white p-10'>
      <NavBar
        changeMenu={changeMenu}
        menuState={menuState}
      />
      <div className='flex-1 p-4 py-0 space-y-4'>
        <HeaderTop />
        {menuState === 1 && <Calendar />}
      </div>
      <Blog />
    </div>
  )
}
