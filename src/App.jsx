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

  /* ================= ITEM HANDLERS ================= */

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

  /* ================= CALCULATIONS ================= */

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

  /* ================= INVOICE NUMBER ================= */

  function generateInvoiceNumber() {
    const last = localStorage.getItem("lastInvoiceNo") || "INV-0000";
    const next = Number(last.split("-")[1]) + 1;
    const invoiceNo = `INV-${String(next).padStart(4, "0")}`;
    localStorage.setItem("lastInvoiceNo", invoiceNo);
    return invoiceNo;
  }

  /* ================= PDF DOWNLOAD (FIXED) ================= */

  async function downloadPDF() {
    const newInvoiceNo = generateInvoiceNumber();

    // 1️⃣ Update invoice number
    setDetails((prev) => ({
      ...prev,
      invoiceNo: newInvoiceNo,
    }));

    // 2️⃣ Wait for DOM to update
    setTimeout(async () => {
      const element = invoiceRef.current;

      // IMPORTANT: lock width to A4 before capture
      const originalWidth = element.style.width;
      element.style.width = "794px";

      const canvas = await html2canvas(element, {
        scale: 3, // sharp text
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 794,
      });

      element.style.width = originalWidth;

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let y = 0;
      let heightLeft = imgHeight;

      // First page
      pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Extra pages if content is long
      while (heightLeft > 0) {
        y = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${newInvoiceNo}.pdf`);
    }, 350);
  }

  /* ================= UI ================= */

  return (
    <div className="w-full px-3">
      <Header />

      <div className="w-full mx-auto px-6 bg-white text-black">
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
    </div>
  );
}
