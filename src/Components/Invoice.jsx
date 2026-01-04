import { forwardRef } from "react";

const Invoice = forwardRef(function Invoice(
  { agency, details, items, subtotal, totalGST, total, fmt },
  ref
) {
  return (
    <div
      ref={ref}
      className="
        invoice-print
        w-full
        max-w-[794px]
        mx-auto
        bg-white
        p-4 sm:p-6
        text-sm
        mt-10
      "
    >
      <h3 className="text-center text-xl font-semibold mb-6">
        Tax Invoice
      </h3>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="font-bold">{agency.name}</h2>
          <p>{agency.address}</p>
          <p>{agency.phone}</p>
          <p>GSTIN: {agency.gst}</p>
        </div>

        <div className="sm:text-right">
          <p><strong>Bill To:</strong> {details.to}</p>
          <p>Place: {details.place}</p>
          <p>Date: {details.date}</p>
          <p><strong>Invoice:</strong> {details.invoiceNo}</p>
        </div>
      </div>

      {/* TABLE — always visible in PRINT */}
      <div className="invoice-table mt-6">
        <table className="w-full border border-black border-collapse text-sm">
          <thead>
            <tr>
              {["#", "Item", "Qty", "Price", "Amount", "GST %", "GST", "Total"].map(h => (
                <th key={h} className="border px-2 py-2 text-left">
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
                <tr key={it.id} className="print:break-inside-avoid">
                  <td className="border px-2 py-2">{i + 1}</td>
                  <td className="border px-2 py-2">{it.name}</td>
                  <td className="border px-2 py-2 text-right">{it.qty}</td>
                  <td className="border px-2 py-2 text-right">{fmt(it.price)}</td>
                  <td className="border px-2 py-2 text-right">{fmt(base)}</td>
                  <td className="border px-2 py-2 text-right">{it.gst}%</td>
                  <td className="border px-2 py-2 text-right">{fmt(gstAmt)}</td>
                  <td className="border px-2 py-2 text-right">
                    {fmt(base + gstAmt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW — SCREEN ONLY */}
      <div className="invoice-mobile mt-6 space-y-4">
        {items.map((it, i) => {
          const base = it.qty * it.price;
          const gstAmt = (base * it.gst) / 100;

          return (
            <div key={it.id} className="border p-4 text-xs rounded-md">
              <p className="font-semibold mb-2">
                {i + 1}. {it.name}
              </p>
              <div className="grid grid-cols-2 gap-y-2">
                <span>Qty</span><span className="text-right">{it.qty}</span>
                <span>Price</span><span className="text-right">{fmt(it.price)}</span>
                <span>Amount</span><span className="text-right">{fmt(base)}</span>
                <span>GST</span><span className="text-right">{fmt(gstAmt)}</span>
                <span className="font-semibold">Total</span>
                <span className="text-right font-semibold">{fmt(base + gstAmt)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="mt-8 ml-auto w-full sm:w-64 space-y-2 border-t pt-4">
        <div className="flex justify-between">
          <span>Sub Total</span>
          <span>{fmt(subtotal())}</span>
        </div>
        <div className="flex justify-between">
          <span>Total GST</span>
          <span>{fmt(totalGST())}</span>
        </div>
        <div className="flex justify-between font-semibold border-t pt-2">
          <span>Grand Total</span>
          <span>{fmt(total())}</span>
        </div>
      </div>

      <div className="mt-20 text-right">
        <p className="font-bold">Authorized Signature</p>
      </div>
    </div>
  );
});

export default Invoice;
