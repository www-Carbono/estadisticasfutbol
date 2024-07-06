import React, { useContext, useState } from 'react'
interface Props {
  isCalendarLoaded: boolean | null
  ChangeCalendarLoaded: (bool: boolean) => void
}
const LoaderContext = React.createContext<Props>({
  isCalendarLoaded: true,
  ChangeCalendarLoaded: () => {}
})

export const UseLoading = () => {
  return useContext(LoaderContext)
}

interface childrenProps {
  children: React.ReactNode
}

export const LoaderProvider = ({ children }: childrenProps) => {
  const [isCalendarLoaded, setIsCalendarLoaded] = useState(false)

  const ChangeCalendarLoaded = (bool: boolean) => {
    setIsCalendarLoaded(bool)
  }

  return (
    <LoaderContext.Provider value={{ isCalendarLoaded, ChangeCalendarLoaded }}>
      {children}
    </LoaderContext.Provider>
  )
}
