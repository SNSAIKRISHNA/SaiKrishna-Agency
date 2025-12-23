import "./App.css";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import Invoice from "./Components/Invoice";
import InvoiceDetails from "./Components/InvoiceDetails";
import ItemsEditor from "./Components/ItemsEditor";
import Header from "./Components/Header";

export default function App() {
  const invoiceRef = useRef(null);

  const [agency] = useState({
    name: "Saikrishna Agency",
    address: "Tamil Nadu, India",
    phone: "8489014499",
    gst: "33ABCDE1234F1Z5",
  });

  const [details, setDetails] = useState({
    to: "",
    place: "",
    date: "",
    invoiceNo: "",
  });

  const [items, setItems] = useState([
    { id: 1, name: "", qty: 1, price: 1, gst: 5 },
  ]);

  function updateItem(id, field, value) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), name: "", qty: 1, price: 0, gst: 5 },
    ]);
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  function subtotal() {
    return items.reduce((sum, it) => sum + it.qty * it.price, 0);
  }

  function totalGST() {
    return items.reduce((sum, it) => {
      const base = it.qty * it.price;
      return sum + (base * it.gst) / 100;
    }, 0);
  }

  function total() {
    return subtotal() + totalGST();
  }

  function fmt(val) {
    return `₹${val.toFixed(2)}`;
  }

  function generateInvoiceNumber() {
    const last = localStorage.getItem("lastInvoiceNo") || "INV-0000";
    const next = Number(last.split("-")[1]) + 1;
    const invoiceNo = `INV-${String(next).padStart(4, "0")}`;
    localStorage.setItem("lastInvoiceNo", invoiceNo);
    return invoiceNo;
  }

  
  async function downloadPDF() {
    const newInvoiceNo = generateInvoiceNumber();

    setDetails((prev) => ({
      ...prev,
      invoiceNo: newInvoiceNo,
    }));

    
    setTimeout(async () => {
      const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${newInvoiceNo}.pdf`);
    }, 300);
  }

  return (
    <>
      <Header />
      <div className="app">
        <InvoiceDetails details={details} setDetails={setDetails} />

        <ItemsEditor
          items={items}
          updateItem={updateItem}
          addItem={addItem}
          removeItem={removeItem}
          downloadPDF={downloadPDF}
        />

        <Invoice
          ref={invoiceRef}
          agency={agency}
          details={details}
          items={items}
          subtotal={subtotal}
          totalGST={totalGST}
          total={total}
          fmt={fmt}
        />
      </div>
    </>
  );
}
