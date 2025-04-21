import { useState } from "react";
import {X, Menu} from 'lucide-react';

export default function NavBar() {

      // State to manage the navbar's visibility
  const [nav, setNav] = useState(false);

  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  // Array containing navigation items
  const navItems = [
    { id: 1, text: 'Home' },
    { id: 2, text: 'Sales' },
    { id: 3, text: 'Products' },
    { id: 4, text: 'Settings' },
  ];

    return (
        <>
        <div className='flex justify-between items-center h-12 mx-auto px-4 bg-base'>
      {/* Logo */}
      <h1 className='w-full text-3xl font-bold text-primary-dark'>REACT.</h1>

      {/* Desktop Navigation */}
      <ul className='hidden md:flex'>
        {navItems.map(item => (
          <li
            key={item.id}
            className='m-4 p-4 text-sm/6 font-semibold text-white/50 focus:outline-none hover:text-primary-dark  cursor-pointer'
          >
            {item.text}
          </li>
        ))}
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className='block md:hidden '>
        {nav ? <X /> :  <Menu />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? 'fixed md:hidden left-0 top-0 w-[60%] h-full ease-in-out duration-500 text-sm/6 font-semibold text-white/50 focus:outline-none hover:text-primary-dark  cursor-pointer bg-base '
            : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%] bg-base'
        }
      >
        {/* Mobile Logo */}
        <h1 className='w-full text-3xl font-bold text-primary-dark'>REACT.</h1>

        {/* Mobile Navigation Items */}
        {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 rounded-xl  cursor-pointer border-gray-600 text-sm/6 font-semibold text-white/50 focus:outline-none hover:text-primary-dark'
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
        
        </>
    )
}