import { SalesHistoryData } from "@/types/types";
import Layout from "../layout/Layout";
import { SalesHistory } from "./SalesHistory";
import { useEffect, useState } from "react";


const SaleHistory = () => {

const DEFAULT_SALES_HISTORY: SalesHistoryData = {
  content: [],
  customPage: {
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 10,
  },
};

  const appUrl = import.meta.env.VITE_BACK_URL;
  const [saleData, setSaleData] = useState<SalesHistoryData>(DEFAULT_SALES_HISTORY);

useEffect(()=>{
    fetch(appUrl+"/api/sales")
    .then((data)=> {
        return data.json()
    })
    .then(
        (data:SalesHistoryData)=>{
            setSaleData(data)

        }
    )
   .catch((e)=> {
    alert(e)
   })
}, [])

    return(
        <>
        <Layout>

            <SalesHistory data={saleData}/>
        
        </Layout>
        </>
    )
}


export default SaleHistory;