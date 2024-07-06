import React, { useContext, useState } from 'react'
interface Props {
  menuSelected: number
  ChangeMenuSelected: (NumberMenu: number) => void
}
const LoaderContext = React.createContext<Props>({
  menuSelected: 1,
  ChangeMenuSelected: () => {}
})

export const useSelectedMenuContext = () => {
  return useContext(LoaderContext)
}

interface childrenProps {
  children: React.ReactNode
}

export const Menuprovider = ({ children }: childrenProps) => {
  const [menuSelected, setMenuSelected] = useState(1)

  const ChangeMenuSelected = (NumberMenu: number) => {
    setMenuSelected(NumberMenu)
  }

  return (
    <LoaderContext.Provider value={{ menuSelected, ChangeMenuSelected }}>{children}</LoaderContext.Provider>
  )
}
