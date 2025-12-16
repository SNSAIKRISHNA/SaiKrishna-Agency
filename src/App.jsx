import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "./App.css";

import Header from "./Components/Header.jsx";
import InvoiceDetails from "./Components/InvoiceDetails.jsx";
import ItemsEditor from "./Components/ItemsEditor.jsx";
import Invoice from "./Components/Invoice.jsx";

export default function App() {
  const invoiceRef = useRef(null);

  const agency = {
    name: "Saikrishna Agency",
    address: "80/5 Arcot Road, Sathuvachari",
    gst: "33CRIPM7982G1ZC",
  };

  const [details, setDetails] = useState({
    to: "",
    place: "",
    date: new Date().toISOString().slice(0, 10),
    invoiceNo: "INV-001",
  });

  const [items, setItems] = useState([
    { id: 1, name: "5rs SNAK UP 168 pcs", qty: 30, price: 600 },
  ]);

  const subtotal = () => items.reduce((s, i) => s + i.qty * i.price, 0);
  const tax = (r) => subtotal() * r;
  const total = () => subtotal() + tax(0.05);

  const fmt = (n) =>
    `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  async function downloadPDF() {
    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const pdf = new jsPDF("p", "pt", "a4");
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(canvas, "PNG", 0, 0, w, h);
    pdf.save("invoice.pdf");
  }

  return (
    <div className="app">
      <Header />
      <InvoiceDetails details={details} setDetails={setDetails} />
      <ItemsEditor
        items={items}
        updateItem={(id,f,v)=>setItems(p=>p.map(i=>i.id===id?{...i,[f]:v}:i))}
        addItem={()=>setItems(p=>[...p,{id:Date.now(),name:"",qty:1,price:0}])}
        removeItem={(id)=>setItems(p=>p.filter(i=>i.id!==id))}
        downloadPDF={downloadPDF}
      />
      <h3 className="preview-title">Invoice Preview</h3>
      <Invoice
        ref={invoiceRef}
        agency={agency}
        details={details}
        items={items}
        subtotal={subtotal}
        tax={tax}
        total={total}
        fmt={fmt}
      />
    </div>
  );
}
