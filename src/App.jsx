import React, { useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function App() {
  // Static agency details (as per your photo)
  const agency = {
    name: "SaiKrishna Agency",
    addressLine1: "80/5 ARCOT ROAD STREET SATHUVACHARI",
    city: "Vellore",
    phone: "9750507969",
    gst: "33CRIPM7982G1ZC",
    state: "33-Tamil Nadu",
    logoText: "UNIBIC",
  };

  // Static Bill To (from photo)
  const billTo = {
    name: "SAI KRISHNA AGENCY",
    address: "1ST FLOOR 80/5 ARCOT ROAD STREET SATHUVACHARI",
    contact: "8489014499",
    gst: "33DIUPS7088K1Z5",
    state: "33-Tamil Nadu",
  };

  // Items (editable by provider) - initial items mimic the photo
  const [items, setItems] = useState([
    { id: 1, name: "5rs SNAK UP 168 pcs", qty: 30, price: 600 },
    { id: 2, name: "5rs SNAK UP 224 PCS", qty: 20, price: 800 },
  ]);

  const invoiceRef = useRef(null);

  function updateItem(id, field, value) {
    setItems((s) =>
      s.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  }

  function addItem() {
    setItems((s) => [...s, { id: Date.now(), name: "", qty: 1, price: 0 }]);
  }

  function removeItem(id) {
    setItems((s) => s.filter((it) => it.id !== id));
  }

  function subtotal() {
    return items.reduce(
      (acc, it) => acc + Number(it.qty || 0) * Number(it.price || 0),
      0
    );
  }

  function tax(rate = 0.05) {
    return subtotal() * rate;
  }

  function total() {
    return subtotal() + tax();
  }

  // Robust PDF downloader using slicing to A4 pages
  // Robust PDF downloader using slicing to A4 pages
  async function downloadPDF() {
    const element = invoiceRef.current;
    if (!element) {
      alert("Invoice element not found.");
      return;
    }

    // Capture as canvas (use devicePixelRatio for good resolution)
    const canvas = await html2canvas(element, {
      scale: window.devicePixelRatio || 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
    });

    if (!canvas) {
      alert("Failed to render invoice to canvas.");
      return;
    }

    // Create PDF
    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Points -> pixels conversion (approx)
    const pxPerPt = 96 / 72;
    const pageWidthPx = Math.floor(pdfWidth * pxPerPt);
    const pageHeightPx = Math.floor(pdfHeight * pxPerPt);

    // Scale the canvas so its width matches the PDF page width
    const scale = pageWidthPx / canvas.width;
    const scaledCanvasWidth = Math.floor(canvas.width * scale);
    const scaledCanvasHeight = Math.floor(canvas.height * scale);

    // Draw scaled source into an offscreen canvas
    const scaledSource = document.createElement("canvas");
    scaledSource.width = scaledCanvasWidth;
    scaledSource.height = scaledCanvasHeight;
    const srcCtx = scaledSource.getContext("2d");
    srcCtx.drawImage(
      canvas,
      0,
      0,
      canvas.width,
      canvas.height,
      0,
      0,
      scaledCanvasWidth,
      scaledCanvasHeight
    );

    // Slice the scaled source into pageHeightPx chunks and add pages
    let remainingHeight = scaledCanvasHeight;
    let yOffset = 0;
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = scaledCanvasWidth;
    const tmpCtx = tmpCanvas.getContext("2d");

    let pageCount = 0;
    while (remainingHeight > 0) {
      const sliceHeight = Math.min(pageHeightPx, remainingHeight);
      tmpCanvas.height = sliceHeight;
      tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
      tmpCtx.drawImage(
        scaledSource,
        0,
        yOffset,
        scaledCanvasWidth,
        sliceHeight,
        0,
        0,
        scaledCanvasWidth,
        sliceHeight
      );

      const sliceData = tmpCanvas.toDataURL("image/png");
      const sliceHeightPt = tmpCanvas.height / pxPerPt;

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

    const filename = `invoice_${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, "-")}.pdf`;
    pdf.save(filename);
  }

  // Simple utility to format INR
  function fmt(n) {
    return `₹${Number(n || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return (
    <div
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#000000",
        padding: 20,
        background: "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 12 }}>
          Provider Checkout — Static Agency Invoice
        </h1>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                background: "#fff",
                padding: 12,
                borderRadius: 6,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ margin: "6px 0" }}>Items (editable)</h3>
              {items.map((it) => (
                <div
                  key={it.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 80px 120px 80px",
                    gap: 8,
                    marginBottom: 8,
                    alignItems: "center",
                  }}
                >
                  <input
                    value={it.name}
                    onChange={(e) => updateItem(it.id, "name", e.target.value)}
                    style={{
                      padding: 8,
                      border: "1px solid #ddd",
                      borderRadius: 4,
                    }}
                  />
                  <input
                    type="number"
                    value={it.qty}
                    onChange={(e) =>
                      updateItem(it.id, "qty", Number(e.target.value))
                    }
                    style={{
                      padding: 8,
                      border: "1px solid #ddd",
                      borderRadius: 4,
                    }}
                  />
                  <input
                    type="number"
                    value={it.price}
                    onChange={(e) =>
                      updateItem(it.id, "price", Number(e.target.value))
                    }
                    style={{
                      padding: 8,
                      border: "1px solid #ddd",
                      borderRadius: 4,
                    }}
                  />
                  <button
                    onClick={() => removeItem(it.id)}
                    style={{
                      padding: 8,
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={addItem}
                  style={{
                    padding: 8,
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                  }}
                >
                  Add Item
                </button>
                <button
                  onClick={downloadPDF}
                  style={{
                    padding: 8,
                    background: "#059669",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                  }}
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>

          {/* invoice preview */}
          <div style={{ flex: 1.2 }}>
            <div
              ref={invoiceRef}
              style={{
                background: "#fff",
                padding: 24,
                borderRadius: 6,
                minHeight: 400,
                width: 794,
                color: "#000000",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>
                    {agency.name}
                  </div>
                  <div style={{ fontSize: 12 }}>{agency.addressLine1}</div>
                  <div style={{ fontSize: 12 }}>{agency.city}</div>
                  <div style={{ fontSize: 12 }}>Phone: {agency.phone}</div>
                  <div style={{ fontSize: 12 }}>GSTIN: {agency.gst}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      border: "1px solid #ddd",
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontWeight: 700,
                    }}
                  >
                    {agency.logoText}
                  </div>
                  <div style={{ fontSize: 12, marginTop: 8 }}>Tax Invoice</div>
                </div>
              </div>

              {/* Invoice meta */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>Bill To</div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>
                    {billTo.name}
                  </div>
                  <div style={{ fontSize: 12 }}>{billTo.address}</div>
                  <div style={{ fontSize: 12 }}>
                    Contact No.: {billTo.contact}
                  </div>
                  <div style={{ fontSize: 12 }}>GSTIN: {billTo.gst}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12 }}>Invoice No: 50</div>
                  <div style={{ fontSize: 12 }}>
                    Date: {new Date().toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: 12 }}>
                    Place of Supply: {billTo.state}
                  </div>
                </div>
              </div>

              {/* Items table */}
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: 12,
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr style={{ background: "#f3f4f6" }}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: 8,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      #
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: 8,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      Item Name
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: 8,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      Quantity
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: 8,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      Price/Unit
                    </th>
                    <th
                      style={{
                        textAlign: "right",
                        padding: 8,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={it.id}>
                      <td style={{ padding: 8, border: "1px solid #eee" }}>
                        {idx + 1}
                      </td>
                      <td style={{ padding: 8, border: "1px solid #eee" }}>
                        {it.name}
                      </td>
                      <td
                        style={{
                          padding: 8,
                          border: "1px solid #eee",
                          textAlign: "right",
                        }}
                      >
                        {it.qty}
                      </td>
                      <td
                        style={{
                          padding: 8,
                          border: "1px solid #eee",
                          textAlign: "right",
                        }}
                      >
                        {fmt(it.price)}
                      </td>
                      <td
                        style={{
                          padding: 8,
                          border: "1px solid #eee",
                          textAlign: "right",
                        }}
                      >
                        {fmt(it.qty * it.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ width: 240, fontSize: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "6px 0",
                    }}
                  >
                    <div>Sub Total</div>
                    <div>{fmt(subtotal())}</div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "6px 0",
                    }}
                  >
                    <div>SGST @2.5%</div>
                    <div>{fmt(tax(0.025))}</div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "6px 0",
                    }}
                  >
                    <div>CGST @2.5%</div>
                    <div>{fmt(tax(0.025))}</div>
                  </div>
                  <div
                    style={{
                      borderTop: "1px solid #e5e7eb",
                      fontWeight: 700,
                      paddingTop: 8,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>Total</div>
                    <div>{fmt(total())}</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 20, fontSize: 12 }}>
                <div style={{ fontWeight: 700 }}>Invoice Amount In Words</div>
                <div>Thirty Five Thousand Seven Hundred Rupees only</div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 40,
                }}
              >
                <div style={{ fontSize: 12 }}>
                  <div style={{ fontWeight: 700 }}>Terms And Conditions</div>
                  <div>Thank you for doing business with us.</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div>For: THANGAM TRADERS</div>
                  <div style={{ marginTop: 36 }}>Authorized Signatory</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
