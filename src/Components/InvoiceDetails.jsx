export default function InvoiceDetails({ details, setDetails }) {
  function update(field, value) {
    setDetails((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <section className="w-full py-6">
      <div
        className="
          mx-auto w-full max-w-md sm:max-w-xl md:max-w-2xl bg-gray-200 _professional rounded-xl  p-4 sm:p-6"
      >
        <h3 className="text-center font-semibold text-lg sm:text-xl mb-4">
          Invoice Details
        </h3>

        <div className="flex flex-col gap-4">
          <input
            className="w-full bg-transparent hover:border-b border-gray-500 focus:outline-none focus:border-black py-1"
            placeholder="Bill To"
            value={details.to}
            onChange={(e) => update("to", e.target.value)}
          />

          <input
            className="w-full bg-transparent hover:border-b border-gray-500 focus:outline-none focus:border-black py-1"
            placeholder="Place of Supply"
            value={details.place}
            onChange={(e) => update("place", e.target.value)}
          />

          <input
            className="w-full bg-transparent hover:border-b border-gray-500 focus:outline-none focus:border-black py-1"
            type="date"
            value={details.date}
            onChange={(e) => update("date", e.target.value)}
          />

          <p className="text-sm">
            <strong>Invoice No:</strong>{" "}
            <span className="font-bold ms-2 underline">
              {details.invoiceNo}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
