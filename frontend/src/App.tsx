import Chart from "./components/charts/chart-bar-stacked";
import Layout from "./components/layout/Layout";

export default function App() {
  return (
    <>
    <Layout>
      <h1 className="text-2xl font-bold text-center mb-4">Bienvenido</h1>
      <div className="flex flex-row justify-center items-center">
      <Chart/>
      </div>
    </Layout>
    </>
  )
}
