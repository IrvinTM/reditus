import  React, { useState, ReactNode} from "react";
import {X, Menu} from 'lucide-react';

interface NavBarProps {
  home: ReactNode
  sales: ReactNode
  products: ReactNode
  settings: ReactNode
}

const NavBar: React.FC<NavBarProps> = ({home, sales, products, settings}: NavBarProps) => {

      // State to manage the navbar's visibility
  const [nav, setNav] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>();


  const optionsMap = new Map<string, ReactNode>([
    ["Home", home],
    ["Sales", sales],
    ["Products", products],
    ["Settings",settings]])


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
            className={`m-4 px-4 py-1 text-sm/6 font-semibold  focus:outline-none hover:text-primary-dark  cursor-pointer ${selectedItem === item.text ? 'rounded-xl shadow-surface-2 bg-gradient-to-t from-surface-0 to-base text-primary-dark' : 'bg-base text-white/50'}`}
            onClick={() => setSelectedItem(item.text)}
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
            className='p-4 rounded-xl  cursor-pointer border-surface-0 text-sm/6 font-semibold text-text focus:outline-none hover:text-primary-hover'
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
    <div>
      {
        selectedItem ? optionsMap.get(selectedItem) : home
      }
    </div>

        
        </>
    )
}

export default NavBar;