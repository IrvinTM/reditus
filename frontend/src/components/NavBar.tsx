import  React, { useState, ReactNode, useEffect} from "react";
import {X, Menu, Home, Store, Package, Settings} from 'lucide-react';

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

  const closeNav = () => {
    setNav(false);
  };

  // Array containing navigation items
  const navItems = [
    { id: 1, text: 'Home' },
    { id: 2, text: 'Sales' },
    { id: 3, text: 'Products' },
    { id: 4, text: 'Settings' },
  ];

  useEffect(() => {
    setSelectedItem("Home");
  }, []);

    return (
        <>
        <div className='fixed right-0 top-0 h-full shadow-xl shadow-surface-0 p-2 rounded-2xl'>


      {/* Mobile Navigation Icon */}
     <div className="flex flex-col justify-center items-center text-center">
     <div className="flex flex-col justify-center items-center text-center" onClick={handleNav}>
        {nav ? <X className="w-12 h-12 mt-4 text-text" /> :  <Menu className="w-12 h-12 mt-4 text-text" />}
      </div>
      <div className={`flex flex-col justify-center items-center text-center w-full ${selectedItem === "Home" ? 'rounded-xl shadow-surface-2 shadow-sm bg-gradient-to-t from-surface-2 to-surface-0 text-primary-dark' : 'bg-base text-white/50'}`} onClick={()=>{setSelectedItem("Home")}}>
        { <Home className="w-12 h-12 mt-4 text-text" /> }
        <p>Inicio</p>
      </div>
      <div className={`flex flex-col justify-center items-center text-center w-full ${selectedItem === "Sales" ? 'rounded-xl shadow-surface-2 shadow-sm bg-gradient-to-t from-surface-2 to-surface-0 text-primary-dark' : 'bg-base text-white/50'}`} onClick={()=>{setSelectedItem("Sales")}}>
        { <Store className="w-12 h-12 mt-4 text-text" /> }
        <p >Vender</p>
      </div>
      <div className={`flex flex-col justify-center items-center text-center w-full ${selectedItem === "Products" ? 'rounded-xl shadow-surface-2 shadow-sm bg-gradient-to-t from-surface-2 to-surface-0 text-primary-dark' : 'bg-base text-white/50'}`} onClick={()=>{setSelectedItem("Products")}}>
        { <Package className="w-12 h-12 mt-4 text-text" /> }
        <p className="m-1">Productos</p>
      </div>
      <div className={`flex flex-col justify-center items-center text-center w-full ${selectedItem === "Settings" ? 'rounded-xl shadow-surface-2 shadow-sm bg-gradient-to-t from-surface-2 to-surface-0 text-primary-dark' : 'bg-base text-white/50'}`} onClick={()=>{setSelectedItem("Settings")}}>
        { <Settings className="w-12 h-12 mt-4 text-text" /> }
        <p className="m-1">Ajustes</p>
      </div>
     </div>


      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? 'fixed shadow-2xl shadow-surface-0 right-0 top-0 w-auto rounded-sm h-full ease-in-out duration-500 text-sm/6 font-semibold text-white/50 focus:outline-none hover:text-primary-dark  cursor-pointer bg-base '
            : 'ease-in-out w-auto duration-500 fixed top-0 bottom-0 right-[-100%]'
        }
      >


<div className="flex flex-col items-center mt-4">
<div onClick={handleNav}>
        {nav ? <X className="w-12 h-12 text-text mt-4" /> :  <Menu className="w-6 h-6 text-text mt-4" />}
      </div>
{/* Mobile Navigation Items */}
{navItems.map(item => (
           <li
           key={item.id}
           className={`m-12 p-12 py-1 text-xl font-semibold  focus:outline-none hover:text-primary-dark  cursor-pointer ${selectedItem === item.text ? 'rounded-xl shadow-surface-2 shadow-sm bg-gradient-to-t from-surface-0 to-base text-primary-dark' : 'bg-base text-white/50'}`}
           onClick={() => {setSelectedItem(item.text); handleNav();}}
         >
           {item.text}
         </li>
        ))}
      </div>
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