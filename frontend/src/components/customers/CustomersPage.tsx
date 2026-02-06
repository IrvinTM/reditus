import { useEffect, useState } from "react";
import { Customer } from "@/types/types";
import Layout from "../layout/Layout";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AddCustomer } from "./AddCustomer";
import CustomerCard from "./CustomerCard";

const CustomersPage = () => {
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const appUrl = import.meta.env.VITE_BACK_URL;
  const [searchText, setSearchText] = useState("");

  const getCustomers = () => {
    fetch(appUrl + "/api/customers")
      .then((response) => {
        response.json().then((data) => {
          setCustomerList(data.content);
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getCustomers();
  }, []);

  const handleSearch = async (searchParam: string) => {
    if (searchParam === "") {
      getCustomers();
      return;
    }

    // Simple frontend filtering for this iteration
    const filtered = customerList.filter(c =>
      c.name.toLowerCase().includes(searchParam.toLowerCase()) ||
      c.identification.includes(searchParam) ||
      c.email.toLowerCase().includes(searchParam.toLowerCase())
    );
    setCustomerList(filtered);


    if (searchParam.includes("@")) {
      try {
        const res = await fetch(appUrl + "/api/customers/email/" + searchParam);
        if (res.ok) {
          const data = await res.json();
          setCustomerList([data]);
        } else {
          setCustomerList([]);
        }
      } catch (e) { setCustomerList([]); }
    } else {
      // Try identification
      try {
        const res = await fetch(appUrl + "/api/customers/identification/" + searchParam);
        if (res.ok) {
          const data = await res.json();
          setCustomerList([data]);
          return;
        }
      } catch (e) { }

      // Try phone
      try {
        const res = await fetch(appUrl + "/api/customers/phone/" + searchParam);
        if (res.ok) {
          const data = await res.json();
          setCustomerList([data]);
          return;
        }
      } catch (e) { }

      // Fallback to frontend filter of current list if nothing found (or empty list)
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="flex gap-2 mb-6">
          <AddCustomer onCustomerSuccess={getCustomers} />
          <Input
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              if (e.target.value === "") getCustomers();
            }}
            placeholder="Buscar por ID, Email o Teléfono"
          />
          <Button onClick={() => handleSearch(searchText)}>Buscar</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {customerList.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onCustomerDeleted={getCustomers}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CustomersPage;
