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
  isGenerating,
}) {
  function handleProductSelect(id, productName) {
    const product = PRODUCTS.find((p) => p.name === productName);
    if (!product) return;

    updateItem(id, "name", product.name);
    updateItem(id, "price", product.price);
    updateItem(id, "gst", product.gst);
  }

  return (
    <section className="w-full px-4 py-6">
      <div className="mx-auto w-full max-w-md sm:max-w-xl md:max-w-4xl lg:max-w-6xl bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border border-gray-200 animate-slide-up">
        <h3 className="text-center text-2xl sm:text-3xl font-bold mb-6 text-gray-800 tracking-wide">
          Items
        </h3>

        {/* Table Header - Hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-6 gap-3 mb-4 px-2 text-sm font-semibold text-gray-600">
          <div>Product</div>
          <div>Quantity</div>
          <div>Price (₹)</div>
          <div>GST (%)</div>
          <div>Total (₹)</div>
          <div>Action</div>
        </div>

        {/* Items List */}
        <div className="flex flex-col gap-4">
          {items.map((it, index) => {
            const total = it.qty * it.price * (1 + it.gst / 100);

            return (
              <div
                key={it.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-gray-200 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Mobile Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Product
                    </label>
                    <select
                      className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2 focus:outline-none transition-colors duration-300 bg-white"
                      value={it.name}
                      onChange={(e) =>
                        handleProductSelect(it.id, e.target.value)
                      }
                    >
                      <option value="">Select Product</option>
                      {PRODUCTS.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Quantity
                    </label>
                    <input
                      className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2 focus:outline-none transition-colors duration-300"
                      type="number"
                      min="1"
                      value={it.qty}
                      onChange={(e) =>
                        updateItem(it.id, "qty", Number(e.target.value))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Price (₹)
                    </label>
                    <input
                      className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2 focus:outline-none transition-colors duration-300"
                      type="number"
                      value={it.price}
                      onChange={(e) =>
                        updateItem(it.id, "price", Number(e.target.value))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      GST (%)
                    </label>
                    <select
                      className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2 focus:outline-none transition-colors duration-300 bg-white"
                      value={it.gst}
                      onChange={(e) =>
                        updateItem(it.id, "gst", Number(e.target.value))
                      }
                    >
                      <option value={5}>5%</option>
                      <option value={9}>9%</option>
                      <option value={2.5}>2.5%</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                      <span className="text-sm font-medium text-gray-700">
                        Total Amount:
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg px-4 py-2 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] font-medium"
                      onClick={() => removeItem(it.id)}
                    >
                      Remove Item
                    </button>
                  </div>
                </div>

                {/* Desktop/Tablet Layout */}
                <div className="hidden md:grid md:grid-cols-6 gap-3 items-center">
                  <select
                    className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2 focus:outline-none transition-colors duration-300 bg-white"
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
                    className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2 focus:outline-none transition-colors duration-300"
                    type="number"
                    min="1"
                    value={it.qty}
                    onChange={(e) =>
                      updateItem(it.id, "qty", Number(e.target.value))
                    }
                  />

                  <input
                    className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2 focus:outline-none transition-colors duration-300"
                    type="number"
                    value={it.price}
                    onChange={(e) =>
                      updateItem(it.id, "price", Number(e.target.value))
                    }
                  />

                  <select
                    className="w-full border-2 border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2 focus:outline-none transition-colors duration-300 bg-white"
                    value={it.gst}
                    onChange={(e) =>
                      updateItem(it.id, "gst", Number(e.target.value))
                    }
                  >
                    <option value={5}>5%</option>
                    <option value={9}>9%</option>
                    <option value={2.5}>2.5%</option>
                  </select>

                  <div className="font-bold text-blue-600 text-lg">
                    ₹{total.toFixed(2)}
                  </div>

                  <button
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg px-3 py-2 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] font-medium"
                    onClick={() => removeItem(it.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg px-6 py-3 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-semibold"
            onClick={addItem}
          >
            + Add Item
          </button>

          <button
            className={`w-full sm:w-auto ${
              isGenerating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            } text-white rounded-lg px-6 py-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-semibold disabled:transform-none`}
            onClick={downloadPDF}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating...
              </span>
            ) : (
              "📥 Download PDF"
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
