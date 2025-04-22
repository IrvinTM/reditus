import Home from "./components/Home"
import NavBar from "./components/NavBar"
import Products from "./components/Products"
import Sales from "./components/Sales"
import Settings from "./components/Settings"

function App() {

  return (
    <>
      <NavBar
        home={<Home />}
        sales={<Sales />}
        products={<Products />}
        settings={<Settings />}
      />
    </>
  )
}

export default App
