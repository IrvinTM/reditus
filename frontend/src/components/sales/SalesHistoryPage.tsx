import { SalesHistoryData } from "@/types/types";
import Layout from "../layout/Layout";
import { SalesHistory } from "./SalesHistory";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";


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
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(0);
  const size = 20;

  useEffect(() => {
    setLoading(true);
    fetch(`${appUrl}/api/sales?page=${page}&size=${size}`)
      .then((data) => {
        return data.json();
      })
      .then((data: SalesHistoryData) => {
        console.log("Fetched sales data:", data);
        setSaleData(data);
        setLoading(false);
      })
      .catch((e) => {
        alert(e);
        setLoading(false);
      });
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

    return(
        <>
        <Layout>
{
    loading ? <div className="min-h-screen bg-muted/30 p-4 md:p-8 flex justify-center content-center items-center"> <Spinner  className="size-6"/> </div> : <SalesHistory data={saleData} onPageChange={handlePageChange}/>
}
        
        </Layout>
        </>
    )
}


export default SaleHistory;