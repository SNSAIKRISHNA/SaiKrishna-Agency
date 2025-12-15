import { forwardRef } from "react";

const Invoice = forwardRef(
  ({ agency, details, items, subtotal, tax, total, fmt }, ref) => {
    return (
      <div ref={ref} className="invoice">
        <div className="invoice-header">
          <div>
            <h2>{agency.name}</h2>
            <p>{agency.address}</p>
            <p>GSTIN: {agency.gst}</p>
          </div>
          <div>
            <p><strong>Invoice:</strong> {details.invoiceNo}</p>
            <p>Date: {details.date}</p>
            <p>Place: {details.place}</p>
          </div>
        </div>

        <p><strong>Bill To:</strong> {details.to}</p>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>#</th><th>Item</th><th>Qty</th><th>Price</th><th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={it.id}>
                <td>{i + 1}</td>
                <td>{it.name}</td>
                <td>{it.qty}</td>
                <td>{fmt(it.price)}</td>
                <td>{fmt(it.qty * it.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-totals">
          <div>Sub Total: {fmt(subtotal())}</div>
          <div>SGST 2.5%: {fmt(tax(0.025))}</div>
          <div>CGST 2.5%: {fmt(tax(0.025))}</div>
          <strong>Total: {fmt(total())}</strong>
        </div>
      </div>
    );
  }
);

export default Invoice;
