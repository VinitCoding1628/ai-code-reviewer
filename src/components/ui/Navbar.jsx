import React from 'react'
import logo from '../../assets/images/logo.svg'
import { Spin } from '@/components/ui/spin'

const Navbar = () => {
  return (
    <>
        <nav className='flex justify-between items-center p-4 bg-inherit backdrop-blur-xl backdrop-brightness-105 shadow-sm fixed top-0 w-full border-b-[0.1px] border-muted-foreground z-10'>
            <div className='flex items-center gap-2'>
                <img src={logo} alt="logo" />
                <h1 className='text-xl font-semibold'>CodeRev</h1>
            </div>
            <Spin className='text-xl text-foreground' />
        </nav>
    </>
  )
}

export default Navbar