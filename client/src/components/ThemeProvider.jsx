import React from 'react'
import { useSelector } from 'react-redux'

function ThemeProvider({children}) {
    const {theme} = useSelector(state => state.theme)
  return (
    <div className={theme}>
        <div className='bg-off-white text-stone-800
            dark:text-ivory dark:bg-zinc-900' >
        {children}
        </div>
    </div>
  )
}

export default ThemeProvider; 