import { forwardRef } from "react";

const Invoice = forwardRef(function Invoice(
  { agency, details, items, subtotal, totalGST, total, fmt },
  ref
) {
  return (
    <div ref={ref} className="invoice">
      <h3 className="invoice-tittle">Tax Invoice</h3>

      <div className="invoice-header">
        <div>
          <h2>{agency.name}</h2>
          <p>{agency.address}</p>
          <p>{agency.phone}</p>
          <p>GSTIN: {agency.gst}</p>
        </div>

        <div className="invoice-right">
          <p><strong>Bill To:</strong> {details.to}</p>
          <p>Place: {details.place}</p>
          <p>Date: {details.date}</p>
          <p><strong>Invoice:</strong> {details.invoiceNo}</p>
        </div>
      </div>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Amount</th>
            <th>GST %</th>
            <th>GST</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {items.map((it, i) => {
            const base = it.qty * it.price;
            const gstAmt = (base * it.gst) / 100;

            return (
              <tr key={it.id}>
                <td>{i + 1}</td>
                <td>{it.name}</td>
                <td>{it.qty}</td>
                <td>{fmt(it.price)}</td>
                <td>{fmt(base)}</td>
                <td>{it.gst}%</td>
                <td>{fmt(gstAmt)}</td>
                <td>{fmt(base + gstAmt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="invoice-totals">
        <div>Sub Total: {fmt(subtotal())}</div>
        <div>Total GST: {fmt(totalGST())}</div>
        <strong>Grand Total: {fmt(total())}</strong>
      </div>

      <h4 className="signature">Authorized Signature</h4>
    </div>
  );
});

export default Invoice;