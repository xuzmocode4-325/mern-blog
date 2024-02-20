import React from 'react'
import { useSelector } from 'react-redux'

const ThemeProvider = ({children}) =>  {
    const {theme} = useSelector(state => state.theme)
  return (
    <div className={theme}>
        <div className='bg-white text-stone-800
            dark:text-ivory dark:bg-[rgb(31,41,55)]' >
        {children}
        </div>
    </div>
  )
}

export default ThemeProvider; 