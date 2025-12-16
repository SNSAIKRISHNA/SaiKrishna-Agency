export default function ItemsEditor({
  items,
  updateItem,
  addItem,
  removeItem,
  downloadPDF,
}) {
  return (
    <div className="section">
      <h3>Items</h3>

      {items.map((it) => (
        <div className="item-row" key={it.id}>
          <input
            value={it.name}
            onChange={(e) => updateItem(it.id, "name", e.target.value)}
          />
          <input
            type="number"
            value={it.qty}
            onChange={(e) => updateItem(it.id, "qty", Number(e.target.value))}
          />
          <input
            type="number"
            value={it.price}
            onChange={(e) =>
              updateItem(it.id, "price", Number(e.target.value))
            }
          />
          <button className="danger" onClick={() => removeItem(it.id)}>
            Remove
          </button>
        </div>
      ))}

      <button className="primary" onClick={addItem}>Add Item</button>
      <button className="success" onClick={downloadPDF}>Download PDF</button>
    </div>
  );
}
