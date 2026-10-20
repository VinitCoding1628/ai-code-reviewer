import React from 'react'
import logo from '../../assets/images/logo.svg'
import { Spin } from '@/components/ui/spin'
import { useTheme } from '@/hooks/useTheme'

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
        <nav className='flex justify-between items-center p-4 bg-inherit backdrop-blur-xl backdrop-brightness-105 fixed top-0 w-full border-b-[0.01px] border-muted-foreground z-90'>
            <div className='flex items-center gap-2'>
                <img src={logo} alt="logo" />
                <h1 className='text-xl font-semibold'>CodeRev</h1>
            </div>
            <Spin toggled={theme === 'dark'} onClick={toggleTheme} className='text-xl text-foreground cursor-pointer' />
        </nav>
    </>
  )
}

export default Navbar