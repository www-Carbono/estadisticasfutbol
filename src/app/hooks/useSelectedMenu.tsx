'use client'
import { useState } from 'react'

export function useSelectedMenu() {
  const [menuState, setMenuState] = useState(1)

  const changeMenu = (menuNumber: number) => {
    setMenuState(menuNumber)
  }

  return { menuState, changeMenu }
}
