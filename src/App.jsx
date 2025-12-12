import React, { useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function App() {
  // Agency details (can be loaded from API/DB)
  const [agency, setAgency] = useState({
    name: "Acme Agency",
    address: "123, Main Street, Bengaluru, India",
    phone: "+91 98765 43210",
    email: "hello@acme.agency",
    gst: "29ABCDE1234F1Z5",
  });

  // Order / checkout (provider-facing)
  const [providerName, setProviderName] = useState("");
  const [items, setItems] = useState([
    { id: 1, name: "Product A", qty: 1, price: 500 },
  ]);

  const invoiceRef = useRef(null);

  function addItem() {
    setItems((s) => [...s, { id: Date.now(), name: "", qty: 1, price: 0 }]);
  }

  function updateItem(id, field, value) {
    setItems((s) => s.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  }

  function removeItem(id) {
    setItems((s) => s.filter((it) => it.id !== id));
  }

  function subtotal() {
    return items.reduce((acc, it) => acc + Number(it.qty || 0) * Number(it.price || 0), 0);
  }

  function tax(rate = 0.18) {
    return subtotal() * rate;
  }

  function total() {
    return subtotal() + tax();
  }

async function downloadPDF() {
  const element = invoiceRef.current;
  if (!element) {
    alert("Invoice element not found.");
    return;
  }

  // 1) Capture the element as a high-resolution canvas
  const canvas = await html2canvas(element, {
    scale: 2,            // higher scale -> better resolution
    useCORS: true,       // try to allow cross-origin images
    allowTaint: false,   // don't allow tainted canvases
    backgroundColor: "#ffffff" // ensure white background (avoid transparency)
  });

  if (!canvas) {
    alert("Failed to render the invoice element to canvas.");
    return;
  }

  const imgData = canvas.toDataURL("image/png");

  // 2) Create jsPDF for A4 page size using 'pt' units (points)
  const pdf = new jsPDF("p", "pt", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();   // in points
  const pdfHeight = pdf.internal.pageSize.getHeight(); // in points

  // 3) Convert page size from points to canvas pixels.
  //    1 pt = 1/72 inch, canvas px typically at 96 DPI
  const pxPerPt = 96 / 72; // = 1.333333...
  const pageWidthPx = Math.floor(pdfWidth * pxPerPt);
  const pageHeightPx = Math.floor(pdfHeight * pxPerPt);

  // 4) If canvas width is larger than page width, scale it down to fit page width
  const scale = Math.min(1, pageWidthPx / canvas.width);
  const scaledCanvasWidth = Math.floor(canvas.width * scale);
  const scaledCanvasHeight = Math.floor(canvas.height * scale);

  // 5) We'll slice the scaled canvas vertically into pageHeightPx chunks.
  // Create an offscreen canvas to hold each slice.
  let remainingHeight = scaledCanvasHeight;
  let yOffset = 0;

  // Create a temporary canvas used for slicing pages
  const tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = scaledCanvasWidth;
  tmpCanvas.height = Math.min(pageHeightPx, remainingHeight);
  const tmpCtx = tmpCanvas.getContext("2d");

  // Draw scaled source into an intermediate canvas to preserve quality when scaling
  const scaledSource = document.createElement("canvas");
  scaledSource.width = scaledCanvasWidth;
  scaledSource.height = scaledCanvasHeight;
  const srcCtx = scaledSource.getContext("2d");
  srcCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvasWidth, scaledCanvasHeight);

  // Add pages until we've consumed the whole scaledSource
  let pageCount = 0;
  while (remainingHeight > 0) {
    const sliceHeight = Math.min(pageHeightPx, remainingHeight);
    tmpCanvas.height = sliceHeight; // resize for current slice

    // Clear and draw the slice from scaledSource
    tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
    tmpCtx.drawImage(
      scaledSource,
      0, yOffset,                          // source x, y
      scaledCanvasWidth, sliceHeight,     // source w, h
      0, 0,                                // dest x, y
      scaledCanvasWidth, sliceHeight      // dest w, h
    );

    // Export slice to image and add to PDF
    const sliceData = tmpCanvas.toDataURL("image/png");
    // convert the slice height/width from px to points for jsPDF:
    const sliceWidthPt = tmpCanvas.width / pxPerPt;   // px -> pt
    const sliceHeightPt = tmpCanvas.height / pxPerPt; // px -> pt

    if (pageCount === 0) {
      pdf.addImage(sliceData, "PNG", 0, 0, pdfWidth, sliceHeightPt);
    } else {
      pdf.addPage();
      pdf.addImage(sliceData, "PNG", 0, 0, pdfWidth, sliceHeightPt);
    }

    pageCount += 1;
    yOffset += sliceHeight;
    remainingHeight -= sliceHeight;
  }

  const filename = `invoice_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.pdf`;
  pdf.save(filename);
}


  function saveInvoiceLocally() {
    const invoice = {
      id: Date.now(),
      provider: providerName,
      agency,
      items,
      subtotal: subtotal(),
      tax: tax(),
      total: total(),
      createdAt: new Date().toISOString(),
    };
    // placeholder: save in localStorage. Replace with API POST to store server-side
    const stored = JSON.parse(localStorage.getItem("invoices") || "[]");
    stored.push(invoice);
    localStorage.setItem("invoices", JSON.stringify(stored));
    alert("Invoice saved locally (use server-side API in production)");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Agency Provider Checkout & Invoice</h1>
          <div className="text-sm text-gray-600">Provider-only portal (example)</div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Checkout/Form */}
          <section className="col-span-1 bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-3">Checkout (Provider)</h2>

            <label className="block text-sm mb-2">Provider name</label>
            <input
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              className="w-full p-2 border rounded mb-3"
              placeholder="Provider name or ID"
            />

            <h3 className="font-medium mt-3">Items</h3>
            <div className="space-y-3">
              {items.map((it) => (
                <div key={it.id} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    className="col-span-5 p-2 border rounded"
                    placeholder="Item name"
                    value={it.name}
                    onChange={(e) => updateItem(it.id, "name", e.target.value)}
                  />
                  <input
                    type="number"
                    className="col-span-2 p-2 border rounded"
                    value={it.qty}
                    onChange={(e) => updateItem(it.id, "qty", Number(e.target.value))}
                    min={1}
                  />
                  <input
                    type="number"
                    className="col-span-3 p-2 border rounded"
                    value={it.price}
                    onChange={(e) => updateItem(it.id, "price", Number(e.target.value))}
                    min={0}
                  />
                  <button
                    className="col-span-2 p-2 bg-red-500 text-white rounded"
                    onClick={() => removeItem(it.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={addItem}>
                Add item
              </button>
            </div>

            <div className="mt-4">
              <h3 className="font-medium">Agency details (appear on invoice)</h3>
              <input
                className="w-full p-2 border rounded mb-2"
                value={agency.name}
                onChange={(e) => setAgency((a) => ({ ...a, name: e.target.value }))}
              />
              <input
                className="w-full p-2 border rounded mb-2"
                value={agency.address}
                onChange={(e) => setAgency((a) => ({ ...a, address: e.target.value }))}
              />
              <div className="flex gap-2">
                <input
                  className="w-1/2 p-2 border rounded mb-2"
                  value={agency.phone}
                  onChange={(e) => setAgency((a) => ({ ...a, phone: e.target.value }))}
                />
                <input
                  className="w-1/2 p-2 border rounded mb-2"
                  value={agency.email}
                  onChange={(e) => setAgency((a) => ({ ...a, email: e.target.value }))}
                />
              </div>
              <input
                className="w-full p-2 border rounded mb-2"
                value={agency.gst}
                onChange={(e) => setAgency((a) => ({ ...a, gst: e.target.value }))}
              />
            </div>

            <div className="mt-4 flex gap-2">
              <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={saveInvoiceLocally}>
                Save invoice (local)
              </button>
              <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={downloadPDF}>
                Download PDF
              </button>
            </div>
          </section>

          {/* Right: Invoice preview */}
          <section className="md:col-span-2 bg-white p-4 rounded shadow">
            <div ref={invoiceRef} className="p-6 bg-white rounded" style={{ width: "100%" }}>
              {/* Invoice header */}
              <div className="flex justify-between items-start border-b pb-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold">{agency.name}</h2>
                  <div className="text-sm whitespace-pre-line">{agency.address}</div>
                  <div className="text-sm">Phone: {agency.phone}</div>
                  <div className="text-sm">Email: {agency.email}</div>
                  <div className="text-sm">GST: {agency.gst}</div>
                </div>
                <div className="text-right">
                  <h3 className="font-semibold">Invoice</h3>
                  <div className="text-sm">Date: {new Date().toLocaleDateString()}</div>
                  <div className="text-sm">To: {providerName || "[Provider name]"}</div>
                </div>
              </div>

              {/* Items table */}
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-1">Item</th>
                    <th className="py-1">Qty</th>
                    <th className="py-1">Price</th>
                    <th className="py-1">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id} className="border-b">
                      <td className="py-2">{it.name || "-"}</td>
                      <td className="py-2">{it.qty}</td>
                      <td className="py-2">₹{Number(it.price).toFixed(2)}</td>
                      <td className="py-2">₹{(it.qty * it.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end gap-4">
                <div className="w-1/3">
                  <div className="flex justify-between py-1"><div>Subtotal</div><div>₹{subtotal().toFixed(2)}</div></div>
                  <div className="flex justify-between py-1"><div>Tax (18%)</div><div>₹{tax().toFixed(2)}</div></div>
                  <div className="flex justify-between font-semibold py-2 border-t"><div>Total</div><div>₹{total().toFixed(2)}</div></div>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-600">Notes: Thank you for your business.</div>
            </div>
          </section>
        </div>

        <footer className="text-xs text-gray-500 mt-6">Tip: Use server-side storage & authentication for provider-only access and to keep agency details persistent.</footer>
      </div>
    </div>
  );
}


