import { useState } from "react";

const AddEmiModal = ({ isOpen, onRequestClose, onSubmit }) => {
  const [emiAmount, setEmiAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(emiAmount);
    if (isNaN(amount) || amount <= 0 || !paymentMethod) {
      alert("Please enter a valid amount and select a payment method");
      return;
    }

    const paymentDate = new Date().toISOString();
    onSubmit(amount, paymentMethod, paymentDate);
    setEmiAmount("");
    setPaymentMethod("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-8 text-center">Add EMI</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 mt-5 flex flex-col-reverse relative">
            <input
              placeholder="Enter EMI amount"
              value={emiAmount}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              onChange={(e) => setEmiAmount(e.target.value)}
              className="peer outline-none border pl-2 py-2 duration-500 border-black focus:border-dashed relative placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 focus:rounded-md"
              required
            />
            <label
              htmlFor="emiAmount"
              className="pl-2 duration-500 opacity-0 peer-focus:opacity-100 -translate-y-5 peer-focus:translate-y-0 absolute left-0 top-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700"
            >
              Enter EMI amount
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Payment Method
            </label>
            <div className="flex space-x-2 border-[2px] border-black rounded-xl select-none">
              <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash"
                  className="peer hidden"
                  checked={paymentMethod === "Cash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="tracking-widest peer-checked:bg-gradient-to-r peer-checked:from-[#000000] peer-checked:to-[#000000] peer-checked:text-white text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out">
                  Cash
                </span>
              </label>

              <label className="radio flex flex-grow items-center justify-center rounded-lg p-1 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="GPay"
                  className="peer hidden"
                  checked={paymentMethod === "GPay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="tracking-widest peer-checked:bg-gradient-to-r peer-checked:from-[#070707] peer-checked:to-[#000000] peer-checked:text-white text-gray-700 p-2 rounded-lg transition duration-150 ease-in-out">
                  GPay
                </span>
              </label>
            </div>
          </div>
          <div className="flex gap-5 ">
            <button
              type="submit"
              className="w-full  cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg
border-blue-600
border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
            >
              Submit
            </button>

            <button
              onClick={onRequestClose}
              className="w-full  cursor-pointer transition-all bg-gray-400 text-white px-6 py-2 rounded-lg
border-gray-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmiModal;
