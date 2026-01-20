import "./App.css";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import Invoice from "./Components/Invoice";
import InvoiceDetails from "./Components/InvoiceDetails";
import ItemsEditor from "./Components/ItemsEditor";
import Header from "./Components/Header";
import Footer from "./Components/fotter";

export default function App() {
  const invoiceRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [agency] = useState({
    name: "Saikrishna Agency",
    address: "Tamil Nadu, India",
    phone: "8489014499",
    gst: "33ABCDE1234F1Z5",
  });

  const [details, setDetails] = useState({
    to: "",
    place: "",
    date: new Date().toISOString().split("T")[0],
    invoiceNo: "",
  });

  const [items, setItems] = useState([
    { id: 1, name: "", qty: 1, price: 0, gst: 5 },
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
    if (!details.to || !details.place || !details.date) {
      alert("Please fill in all invoice details (Bill To, Place, Date)");
      return;
    }

    if (items.length === 0 || items.every((item) => !item.name)) {
      alert("Please add at least one item to the invoice");
      return;
    }

    setIsGenerating(true);

    try {
      const newInvoiceNo = generateInvoiceNumber();

      setDetails((prev) => ({
        ...prev,
        invoiceNo: newInvoiceNo,
      }));

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!invoiceRef.current) {
        throw new Error("Invoice element not found");
      }

      console.log("Starting PDF generation...");

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: 794,
        windowHeight: invoiceRef.current.scrollHeight,
      });

      console.log("Canvas captured successfully");

      const imgData = canvas.toDataURL("image/png");

      if (!imgData || imgData === "data:,") {
        throw new Error("Failed to create image from invoice");
      }

      console.log("Image data created");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const pageHeight = 297;

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      console.log("PDF created successfully");

      pdf.save(`Invoice-${newInvoiceNo}.pdf`);

      alert(`✅ Invoice ${newInvoiceNo} downloaded successfully!`);
    } catch (error) {
      console.error("Detailed PDF generation error:", error);
      alert(`❌ Failed to generate PDF: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      {/* Professional Gray Animated Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-50 via-gray-100 to-slate-200">
        {/* Animated blobs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob-slow"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-slate-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob-slow animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob-slow animation-delay-4000"></div>
        
        {/* Logo Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img 
            src="/Logo.png" 
            alt="Saikrishna Agency Logo" 
            className="w-[600px] h-[600px] object-contain opacity-[0.05] select-none"
            style={{ filter: 'grayscale(50%)' }}
          />
        </div>
        
        {/* Grid and noise patterns */}
        <div className="absolute inset-0 bg-grid-subtle opacity-[0.03]"></div>
        <div className="absolute inset-0 bg-noise opacity-[0.015]"></div>
      </div>

      {/* Content */}
      <div className="relative w-full flex-grow flex flex-col">
        <Header />

        <main className="flex-grow w-full px-3">
          <div className="w-full mx-auto px-3 sm:px-6 pb-10 animate-fade-in-up">
            <InvoiceDetails details={details} setDetails={setDetails} />

            <ItemsEditor
              items={items}
              updateItem={updateItem}
              addItem={addItem}
              removeItem={removeItem}
              downloadPDF={downloadPDF}
              isGenerating={isGenerating}
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
        </main>

        {/* Footer - will stick to bottom */}
        <Footer />
      </div>
    </div>
  );
}