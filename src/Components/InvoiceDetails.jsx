export default function InvoiceDetails({ details, setDetails }) {
  function update(field, value) {
    setDetails((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="section">
      <h3>Invoice Details</h3>

      <input
        placeholder="Bill To"
        value={details.to}
        onChange={(e) => update("to", e.target.value)}
      />

      <input
        placeholder="Place of Supply"
        value={details.place}
        onChange={(e) => update("place", e.target.value)}
      />

      <input
        type="date"
        value={details.date}
        onChange={(e) => update("date", e.target.value)}
      />

      <input
        placeholder="Invoice Number"
        value={details.invoiceNo}
        onChange={(e) => update("invoiceNo", e.target.value)}
      />
    </div>
  );
}
