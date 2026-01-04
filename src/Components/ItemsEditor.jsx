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
    <section className="w-full py-6">
      <div className="mx-auto w-full max-w-md sm:max-w-xl md:max-w-4xl bg-gray-200 rounded-xl shadow-md p-4 sm:p-6 flex flex-col justify-center items-center">
        <h3 className="text-center text-lg sm:text-xl font-semibold mb-4">
          Items
        </h3>
        <div className="flex flex-col justify-center gap-4 md:ms-25">
          {items.map((it) => (
            <div
              key={it.id}
              className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3  items-center " >
              
              <select
                className="w-full border rounded px-2 py-1 w-40"
                value={it.name}
                onChange={(e) =>
                  handleProductSelect(it.id, e.target.value)
                }
              >
                <option value="" >Select Product</option>
                {PRODUCTS.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>

             
              <input
                className="w-full border rounded px-2 py-1"
                type="number"
                min="1"
                value={it.qty}
                onChange={(e) =>
                  updateItem(it.id, "qty", Number(e.target.value))
                }
              />

             
              <input
                className="w-full border rounded px-2 py-1 appearance-none"
                type="number"
                
                value={it.price}
                min={1}
                onChange={(e) =>
                  updateItem(it.id, "price", Number(e.target.value))
                }
              />

            
              <select
                className="w-full border rounded px-2 py-1 text-2lgappearance-none"
                value={it.gst}
                onChange={(e) =>
                  updateItem(it.id, "gst", Number(e.target.value))
                }
              >
                <option value={5}>5%</option>
                <option value={9}>9%</option>
                <option value={2.5}>2.5%</option>
              </select>

            
              <button
                className="w-full bg-red-500 text-white rounded px-3 py-1 hover:bg-red-600"
                onClick={() => removeItem(it.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

       
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            className="w-full sm:w-auto bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
            onClick={addItem}
          >
            Add Item
          </button>

          <button
            className="w-full sm:w-auto bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700"
            onClick={downloadPDF}
          >
            Download PDF
          </button>
        </div>
      </div>
    </section>
  );
}
