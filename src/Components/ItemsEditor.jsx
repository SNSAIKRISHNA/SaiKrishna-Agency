const PRODUCTS = [
  { name: "Jai Moong Dal", price: 100, gst: 5 },
  { name: "Onion Rings", price: 80, gst: 5 },
  { name: "Potato Twists", price: 90, gst: 5 },
  { name: "PopX Basil Seed Drink", price: 40, gst: 5 },
  { name: "Wooper LD 50ml Pouch", price: 200, gst: 9 },
  { name: "Logas Gold Scheme", price: 1000, gst: 2.5 },
];

export default function ItemsEditor({
  items,
  updateItem,
  addItem,
  removeItem,
  downloadPDF,
}) {
  function handleProductSelect(id, productName) {
    const product = PRODUCTS.find((p) => p.name === productName);

    if (!product) return;

    updateItem(id, "name", product.name);
    updateItem(id, "price", product.price);
    updateItem(id, "gst", product.gst);
  }

  return (
    <div className="section">
      <h3>Items</h3>

      {items.map((it) => (
        <div className="item-row" key={it.id}>
        
          <select
            value={it.name}
            onChange={(e) => handleProductSelect(it.id, e.target.value)}
          >
            <option value="">Select Product</option>
            {PRODUCTS.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={it.qty}
            onChange={(e) =>
              updateItem(it.id, "qty", Number(e.target.value))
            }
          />

          <input
            type="number"
            value={it.price}
            onChange={(e) =>
              updateItem(it.id, "price", Number(e.target.value))
            }
          />

          <select
            value={it.gst}
            onChange={(e) =>
              updateItem(it.id, "gst", Number(e.target.value))
            }
          >
            <option value={5}>5%</option>
            <option value={9}>9%</option>
            <option value={2.5}>2.5%</option>
          </select>

          <button className="danger" onClick={() => removeItem(it.id)}>
            Remove
          </button>
        </div>
      ))}

      <button className="primary" onClick={addItem}>
        Add Item
      </button>

      <button className="success" onClick={downloadPDF}>
        Download PDF
      </button>
    </div>
  );
}
