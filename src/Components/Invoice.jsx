import { forwardRef } from "react";

const Invoice = forwardRef(function Invoice(
  { agency, details, items, subtotal, totalGST, total, fmt },
  ref,
) {
  return (
    <div
      ref={ref}
      style={{ backgroundColor: "#ffffff" }}
      className="w-full max-w-[794px] mx-auto p-4 sm:p-8 text-sm print:p-6 mt-10 rounded-xl border-2"
    >
      {/* Header */}
      <div
        className="text-center mb-8 pb-4 border-b-2"
        style={{ borderColor: "#d1d5db" }}
      >
        <h3
          className="text-2xl sm:text-3xl font-bold mb-2"
          style={{ color: "#1f2937" }}
        >
          Tax Invoice
        </h3>
      </div>

      {/* Agency & Bill Details */}
      <div
        className="flex flex-col sm:flex-row justify-between gap-6 mb-8 p-5 rounded-lg border"
        style={{ backgroundColor: "#f9fafb", borderColor: "#e5e7eb" }}
      >
        <div className="flex-1">
          <h2
            className="font-bold text-lg mb-2 flex items-center gap-2"
            style={{ color: "#1f2937" }}
          >
            <span style={{ color: "#2563eb" }}>🏢</span>
            {agency.name}
          </h2>
          <p className="leading-relaxed" style={{ color: "#374151" }}>
            {agency.address}
          </p>
          <p className="mt-1" style={{ color: "#374151" }}>
            📞 {agency.phone}
          </p>
          <p className="mt-1" style={{ color: "#374151" }}>
            <span className="font-semibold">GSTIN:</span> {agency.gst}
          </p>
        </div>

        <div
          className="flex-1 sm:text-right p-4 rounded-lg shadow-sm border-l-4"
          style={{ backgroundColor: "#ffffff", borderLeftColor: "#2563eb" }}
        >
          <p className="mb-2">
            <strong style={{ color: "#1f2937" }}>Bill To:</strong>{" "}
            <span style={{ color: "#374151" }}>{details.to}</span>
          </p>
          <p className="mb-2" style={{ color: "#374151" }}>
            <strong>Place:</strong> {details.place}
          </p>
          <p className="mb-2" style={{ color: "#374151" }}>
            <strong>Date:</strong> {details.date}
          </p>
          <p
            className="px-3 py-2 rounded mt-3 inline-block"
            style={{ backgroundColor: "#eff6ff" }}
          >
            <strong style={{ color: "#1e40af" }}>Invoice #:</strong>{" "}
            <span className="font-bold" style={{ color: "#2563eb" }}>
              {details.invoiceNo}
            </span>
          </p>
        </div>
      </div>

      {/* Desktop Table */}
      <div
        className="hidden md:block mt-6 overflow-hidden rounded-lg border shadow-sm"
        style={{ borderColor: "#d1d5db" }}
      >
        <table className="w-full border-collapse text-sm">
          <thead style={{ backgroundColor: "#2563eb", color: "#ffffff" }}>
            <tr>
              {[
                "#",
                "Item",
                "Qty",
                "Price",
                "Amount",
                "GST %",
                "GST",
                "Total",
              ].map((h) => (
                <th
                  key={h}
                  className="border px-3 py-3 text-left font-semibold"
                  style={{ borderColor: "#3b82f6" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {items.map((it, i) => {
              const base = it.qty * it.price;
              const gstAmt = (base * it.gst) / 100;

              return (
                <tr
                  key={it.id}
                  style={{
                    backgroundColor: i % 2 === 0 ? "#f9fafb" : "#ffffff",
                  }}
                >
                  <td
                    className="border px-3 py-3 font-medium"
                    style={{ borderColor: "#d1d5db", color: "#374151" }}
                  >
                    {i + 1}
                  </td>
                  <td
                    className="border px-3 py-3"
                    style={{ borderColor: "#d1d5db", color: "#1f2937" }}
                  >
                    {it.name}
                  </td>
                  <td
                    className="border px-3 py-3 text-right"
                    style={{ borderColor: "#d1d5db", color: "#374151" }}
                  >
                    {it.qty}
                  </td>
                  <td
                    className="border px-3 py-3 text-right"
                    style={{ borderColor: "#d1d5db", color: "#374151" }}
                  >
                    {fmt(it.price)}
                  </td>
                  <td
                    className="border px-3 py-3 text-right font-medium"
                    style={{ borderColor: "#d1d5db", color: "#1f2937" }}
                  >
                    {fmt(base)}
                  </td>
                  <td
                    className="border px-3 py-3 text-right font-semibold"
                    style={{ borderColor: "#d1d5db", color: "#2563eb" }}
                  >
                    {it.gst}%
                  </td>
                  <td
                    className="border px-3 py-3 text-right"
                    style={{ borderColor: "#d1d5db", color: "#374151" }}
                  >
                    {fmt(gstAmt)}
                  </td>
                  <td
                    className="border px-3 py-3 text-right font-bold"
                    style={{ borderColor: "#d1d5db", color: "#111827" }}
                  >
                    {fmt(base + gstAmt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Tablet View (2-column cards) */}
      <div className="hidden sm:block md:hidden mt-6 space-y-4">
        {items.map((it, i) => {
          const base = it.qty * it.price;
          const gstAmt = (base * it.gst) / 100;
          return (
            <div
              key={it.id}
              className="border-2 rounded-lg p-4"
              style={{ borderColor: "#d1d5db", backgroundColor: "#ffffff" }}
            >
              <p
                className="font-bold text-base mb-3 border-b pb-2"
                style={{ color: "#1f2937", borderColor: "#e5e7eb" }}
              >
                {i + 1}. {it.name}
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "#4b5563" }}>Qty:</span>
                  <span className="font-semibold" style={{ color: "#1f2937" }}>
                    {it.qty}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#4b5563" }}>Price:</span>
                  <span className="font-semibold" style={{ color: "#1f2937" }}>
                    {fmt(it.price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#4b5563" }}>Amount:</span>
                  <span className="font-semibold" style={{ color: "#1f2937" }}>
                    {fmt(base)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#4b5563" }}>GST ({it.gst}%):</span>
                  <span className="font-semibold" style={{ color: "#2563eb" }}>
                    {fmt(gstAmt)}
                  </span>
                </div>
                <div
                  className="col-span-2 flex justify-between pt-2 border-t-2 mt-2"
                  style={{ borderColor: "#d1d5db" }}
                >
                  <span className="font-bold" style={{ color: "#1f2937" }}>
                    Total:
                  </span>
                  <span
                    className="font-bold text-lg"
                    style={{ color: "#16a34a" }}
                  >
                    {fmt(base + gstAmt)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="sm:hidden mt-6 space-y-3">
        {items.map((it, i) => {
          const base = it.qty * it.price;
          const gstAmt = (base * it.gst) / 100;
          return (
            <div
              key={it.id}
              className="border-2 rounded-lg p-4 text-xs shadow-md"
              style={{ borderColor: "#d1d5db", backgroundColor: "#ffffff" }}
            >
              <p
                className="font-bold text-sm mb-3 pb-2 border-b"
                style={{ color: "#1f2937", borderColor: "#e5e7eb" }}
              >
                {i + 1}. {it.name}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span style={{ color: "#4b5563" }}>Quantity:</span>
                  <span className="font-semibold" style={{ color: "#1f2937" }}>
                    {it.qty}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#4b5563" }}>Price:</span>
                  <span className="font-semibold" style={{ color: "#1f2937" }}>
                    {fmt(it.price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#4b5563" }}>Amount:</span>
                  <span className="font-semibold" style={{ color: "#1f2937" }}>
                    {fmt(base)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#4b5563" }}>GST ({it.gst}%):</span>
                  <span className="font-semibold" style={{ color: "#2563eb" }}>
                    {fmt(gstAmt)}
                  </span>
                </div>
                <div
                  className="flex justify-between pt-2 border-t-2 mt-2"
                  style={{ borderColor: "#d1d5db" }}
                >
                  <span className="font-bold" style={{ color: "#1f2937" }}>
                    Total:
                  </span>
                  <span
                    className="font-bold text-base"
                    style={{ color: "#16a34a" }}
                  >
                    {fmt(base + gstAmt)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Totals Section */}
      <div
        className="mt-8 ml-auto w-full sm:w-80 p-5 rounded-lg border-2 shadow-lg"
        style={{ backgroundColor: "#f9fafb", borderColor: "#d1d5db" }}
      >
        <div className="space-y-3 text-sm sm:text-base">
          <div className="flex justify-between" style={{ color: "#374151" }}>
            <span>Sub Total:</span>
            <span className="font-semibold">{fmt(subtotal())}</span>
          </div>
          <div className="flex justify-between" style={{ color: "#374151" }}>
            <span>Total GST:</span>
            <span className="font-semibold" style={{ color: "#2563eb" }}>
              {fmt(totalGST())}
            </span>
          </div>
          <div
            className="flex justify-between font-bold text-lg border-t-2 pt-3 mt-3"
            style={{ borderColor: "#9ca3af" }}
          >
            <span style={{ color: "#1f2937" }}>Grand Total:</span>
            <span className="text-xl" style={{ color: "#16a34a" }}>
              {fmt(total())}
            </span>
          </div>
        </div>
      </div>

      {/* Signature */}
      <div
        className="mt-16 text-right border-t-2 pt-6"
        style={{ borderColor: "#d1d5db" }}
      >
        <div className="inline-block mt-10">
          <div
            className="border-t-2 pt-2 px-8"
            style={{ borderColor: "#1f2937" }}
          >
            <p className="font-bold" style={{ color: "#1f2937" }}>
              Authorized Signature
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Invoice;
