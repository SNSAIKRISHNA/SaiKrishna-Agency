export default function InvoiceDetails({ details, setDetails }) {
  function update(field, value) {
    setDetails((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <section className="w-full px-4 py-6">
      <div className="mx-auto w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 border border-gray-200 animate-slide-up">
        <h3 className="text-center font-bold text-xl sm:text-2xl md:text-3xl mb-6 text-gray-800 tracking-wide">
          Invoice Details
        </h3>

        <div className="flex flex-col gap-5 sm:gap-6">
          <div className="group">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Bill To
            </label>
            <input
              className="w-full bg-white border-b-2 border-gray-300 hover:border-blue-400 focus:border-blue-600 focus:outline-none transition-colors duration-300 py-2 px-3 rounded-t-md text-gray-800 placeholder-gray-400"
              placeholder="Enter customer name"
              value={details.to}
              onChange={(e) => update("to", e.target.value)}
            />
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Place of Supply
            </label>
            <input
              className="w-full bg-white border-b-2 border-gray-300 hover:border-blue-400 focus:border-blue-600 focus:outline-none transition-colors duration-300 py-2 px-3 rounded-t-md text-gray-800 placeholder-gray-400"
              placeholder="Enter location"
              value={details.place}
              onChange={(e) => update("place", e.target.value)}
            />
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Invoice Date
            </label>
            <input
              className="w-full bg-white border-b-2 border-gray-300 hover:border-blue-400 focus:border-blue-600 focus:outline-none transition-colors duration-300 py-2 px-3 rounded-t-md text-gray-800 cursor-pointer"
              type="date"
              value={details.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </div>

          <div className="bg-white border-l-4 border-black rounded-md p-4 mt-2">
            <p className="text-sm sm:text-base text-gray-700">
              <strong className="text-gray-800">Invoice No:</strong>
              <span className="font-bold ml-2 text-blue-600 text-lg">
                {details.invoiceNo}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}