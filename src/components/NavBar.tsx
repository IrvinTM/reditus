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
        <div className='fixed right-0 top-0 h-full shadow-xl shadow-slate-300 p-2 rounded-2xl'>


      {/* Mobile Navigation Icon */}
     <div className="flex flex-col justify-between items-center text-center">
     <div className="flex flex-col justify-between items-center text-center" onClick={handleNav}>
        {nav ? <X className="w-4 h-4 mt-4 " /> :  <Menu strokeWidth={0.5} className="w-6 h-6 mt-4 lg:hidden" />}
      </div>
      <div className={`flex flex-col justify-center items-center text-center w-full  ${selectedItem === "Home" ? 'rounded-xl bg-slate-100' : ' rounded-xl'}`}  onClick={()=>{setSelectedItem("Home")}}>
        { <Home strokeWidth={0.5} className="w-6 h-6 mt-4 " /> }
        <p>Inicio</p>
      </div>
      <div className={`flex flex-col justify-center items-center text-center w-full  ${selectedItem === "Sales" ? 'rounded-xl bg-slate-100' : ' rounded-xl'}`} onClick={()=>{setSelectedItem("Sales")}}>
        { <Store  strokeWidth={0.5} className="w-6 h-6 mt-4 " /> }
        <p >Vender</p>
      </div>
      <div className={`flex flex-col justify-center items-center text-center w-full  ${selectedItem === "Products" ? 'rounded-xl bg-slate-100' : ' rounded-xl'}`} onClick={()=>{setSelectedItem("Products")}}>
        { <Package strokeWidth={0.5} className="w-6 h-6 mt-4 " /> }
        <p className="m-1">Productos</p>
      </div>
      <div className={`flex flex-col justify-center items-center text-center w-full ${selectedItem === "Settings" ? 'rounded-xl bg-slate-100' : ' rounded-xl'}`} onClick={()=>{setSelectedItem("Settings")}}>
        { <Settings strokeWidth={0.5} className="w-6 h-6 mt-4 " /> }
        <p className="m-1">Ajustes</p>
      </div>
     </div>


      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? 'fixed  right-0 top-0 w-auto rounded-sm h-full ease-in-out duration-500 text-sm/6 font-semibold  focus:outline-none  cursor-pointer'
            : 'ease-in-out w-auto duration-500 fixed top-0 bottom-0 right-[-100%]'
        }
      >


<div className="flex flex-col items-center mt-4 bg-white border-1 shadow-xl rounded-xl mb-6">
<div onClick={handleNav}>
        {nav ? <X className="w-6 h-6  mt-4" /> :  <Menu className="w-6 h-6  mt-4" />}
      </div>
{/* Mobile Navigation Items */}
{navItems.map(item => (
           <li
           key={item.id}
           className={`m-12 p-12 py-1 text-xl font-semibold  focus:outline-none  cursor-pointer ${selectedItem === item.text ? 'rounded-xl shadow-surface-2 ' : ''}`}
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