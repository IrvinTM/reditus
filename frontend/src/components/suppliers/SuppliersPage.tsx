import { useEffect, useState } from "react";
import { Supplier } from "@/types/types";
import Layout from "../layout/Layout";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AddSupplier } from "./AddSupplier";
import SupplierCard from "./SupplierCard";

const SuppliersPage = () => {
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const appUrl = import.meta.env.VITE_BACK_URL;
  const [searchText, setSearchText] = useState("");

  const getSuppliers = () => {
    fetch(appUrl + "/api/suppliers")
      .then((response) => {
        response.json().then((data) => {
          setSupplierList(data.content);
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getSuppliers();
  }, []);

  const handleSearch = (searchParam: string) => {
    if (searchParam === "") {
      getSuppliers();
      return;
    }

    const filtered = supplierList.filter((s) =>
      s.name.toLowerCase().includes(searchParam.toLowerCase()) ||
      s.identification.includes(searchParam) ||
      s.email.toLowerCase().includes(searchParam.toLowerCase()) ||
      s.phoneNumber.includes(searchParam)
    );
    setSupplierList(filtered);
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="flex gap-2 mb-6">
          <AddSupplier onSupplierSuccess={getSuppliers} />
          <Input
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              if (e.target.value === "") getSuppliers();
            }}
            placeholder="Buscar por identificacion, email, telefono o nombre"
          />
          <Button onClick={() => handleSearch(searchText)}>Buscar</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {supplierList.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onSupplierDeleted={getSuppliers}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SuppliersPage;
