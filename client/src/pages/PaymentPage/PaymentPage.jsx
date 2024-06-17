import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import apiRequest from "../../lib/apiRequest";
import { format, parseISO } from "date-fns";

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [date, setDate] = useState("");
  const [totalCollection, setTotalCollection] = useState(0);
  const [name, setName] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await apiRequest().get("/payments/receivedPayments");
      // console.log("response: ", response);
      setPayments(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setLoading(false);
    }
  };

  const fetchPaymentsByDate = async () => {
    try {
      setLoading(true);
      const response = await apiRequest().get(
        `/payments/paymentsByDate/${date}`,
        {
          params: {
            name,
            paymentType,
            minAmount,
            maxAmount,
          },
        }
      );

      if (response.data.success && response.data.data.length === 0) {
        setPayments([]);
        setTotalCollection(0);
        toast("No payments found for the selected date");
      } else {
        setPayments(response.data.data);
        setTotalCollection(response.data.totalCollection);
        toast.success("Payments fetched successfully");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payments by date:", error);
      setLoading(false);
      toast.error("Error fetching payments by date");
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center px-6">
      <div className="w-full h-full mt-10 bg-[#454545] p-8 shadow-custom-inset rounded-lg mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Received Payments
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
          <div>
            <label
              htmlFor="date"
              className="block text-gray-800 font-semibold text-sm"
            >
              Date
            </label>
            <div className="mt-2">
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-gray-800 font-semibold text-sm"
            >
              Member Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="name"
                placeholder="Member Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="paymentType"
              className="block text-gray-800 font-semibold text-sm"
            >
              Payment Type
            </label>
            <div className="mt-2">
              <select
                id="paymentType"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              >
                <option value="">All</option>
                <option value="Cash">Cash</option>
                <option value="GPay">GPay</option>
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="minAmount"
              className="block text-gray-800 font-semibold text-sm"
            >
              Min Amount
            </label>
            <div className="mt-2">
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                id="minAmount"
                placeholder="Min Amount"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="maxAmount"
              className="block text-gray-800 font-semibold text-sm"
            >
              Max Amount
            </label>
            <div className="mt-2">
              <input
                id="maxAmount"
                placeholder="Max Amount"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              />
            </div>
          </div>
          <div>
            <button
              onClick={fetchPaymentsByDate}
              className="block mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {loading ? "Loading..." : "Apply Filter"}
            </button>
          </div>
        </div>
        <div className="bg-[#e0e0e0]  border flex  flex-col items-center justify-center p-3  rounded-lg ">
          <h2 className="text-2xl font-bold mb-2">
            Total Collection for{" "}
            {date ? format(parseISO(date), "dd-MM-yyyy") : ""}
          </h2>
          <p className="text-3xl">₹{totalCollection}</p>
        </div>
      </div>
      <div className="w-full bg-white p-8 shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-2">Payments</h2>
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              No payments found for the selected date.
            </p>
            <img
              src="/no_data2.jpg"
              alt="No data"
              height={200}
              width={200}
              className="mx-auto mt-4"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
        ) : (
          <div className="flex flex-wrap -mx-4">
            {payments.map((payment) => (
              <div
                key={payment._id}
                className="w-full md:w-1/2 lg:w-1/2 px-4 mb-4"
              >
                <div className="bg-blue-200 p-4 text-xl rounded-md shadow flex justify-between items-center">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <img
                        src={payment.loan.member.profilePicture}
                        alt={payment.loan.member.name}
                        className="w-10 h-10  rounded-full mr-4"
                      />
                    </div>
                    <div className="">
                      <p className="text-black text-2xl">
                        {payment.loan.member.name}
                      </p>
                      <p className="text-black text-base ">
                        {format(parseISO(payment.date), "dd-MM-yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-1/2 justify-evenly items-center flex-row-reverse ">
                    <p className="text-lg font-semibold">₹{payment.amount}</p>
                    <div className="w-1/2 justify-between items-end scale-125">
                      {payment.paymentType === "Cash" ? (
                        <img src="/cash.png" alt="Cash" className="w-8 h-8" />
                      ) : (
                        <img src="/gpay.png" alt="GPay" className="w-8 h-8" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;

// //Todo

// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import apiRequest from "../../lib/apiRequest";
// import { format, parseISO } from "date-fns";

// const PaymentsPage = () => {
//   const [payments, setPayments] = useState([]);
//   const [date, setDate] = useState("");
//   const [totalCollection, setTotalCollection] = useState(0);
//   const [name, setName] = useState("");
//   const [paymentType, setPaymentType] = useState("");
//   const [minAmount, setMinAmount] = useState("");
//   const [maxAmount, setMaxAmount] = useState("");
//   const [loading, setLoading] = useState(false);
//   let formattedDate = "Invalid date";

//   useEffect(() => {
//     fetchPayments();
//   }, []);
//   if (date) {
//     const parsedDate = parseISO(date);
//     if (isValid(parsedDate)) {
//       formattedDate = format(parsedDate, "dd-MM-yyyy");
//     }
//   }
//   const fetchPayments = async () => {
//     try {
//       setLoading(true);
//       const response = await apiRequest().get("/payments/receivedPayments");
//       setPayments(response.data.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching payments:", error);
//       setLoading(false);
//     }
//   };

//   const fetchPaymentsByDate = async () => {
//     try {
//       setLoading(true);
//       const response = await apiRequest().get(
//         `/payments/paymentsByDate/${date}`,
//         {
//           params: {
//             name,
//             paymentType,
//             minAmount,
//             maxAmount,
//           },
//         }
//       );

//       if (response.data.success && response.data.data.length === 0) {
//         setPayments([]);
//         setTotalCollection(0);
//         toast("No payments found for the selected date");
//       } else {
//         setPayments(response.data.data);
//         setTotalCollection(response.data.totalCollection);
//         toast.success("Payments fetched successfully");
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching payments by date:", error);
//       setLoading(false);
//       toast.error("Error fetching payments by date");
//     }
//   };

//   return (
//     <div className="min-h-full flex flex-col items-center px-6">
//       <div className="w-full h-full mt-10 bg-[#454545] p-8 shadow-custom-inset rounded-lg mb-8">
//         <h1 className="text-3xl font-bold text-center mb-6">
//           Received Payments
//         </h1>
//         <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
//           <div>
//             <label
//               htmlFor="date"
//               className="block text-gray-800 font-semibold text-sm"
//             >
//               Date
//             </label>
//             <div className="mt-2">
//               <input
//                 type="date"
//                 id="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
//               />
//             </div>
//           </div>
//           <div>
//             <label
//               htmlFor="name"
//               className="block text-gray-800 font-semibold text-sm"
//             >
//               Member Name
//             </label>
//             <div className="mt-2">
//               <input
//                 type="text"
//                 id="name"
//                 placeholder="Member Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
//               />
//             </div>
//           </div>
//           <div>
//             <label
//               htmlFor="paymentType"
//               className="block text-gray-800 font-semibold text-sm"
//             >
//               Payment Type
//             </label>
//             <div className="mt-2">
//               <select
//                 id="paymentType"
//                 value={paymentType}
//                 onChange={(e) => setPaymentType(e.target.value)}
//                 className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
//               >
//                 <option value="">All</option>
//                 <option value="Cash">Cash</option>
//                 <option value="GPay">GPay</option>
//               </select>
//             </div>
//           </div>
//           <div>
//             <label
//               htmlFor="minAmount"
//               className="block text-gray-800 font-semibold text-sm"
//             >
//               Min Amount
//             </label>
//             <div className="mt-2">
//               <input
//                 type="text"
//                 inputMode="numeric"
//                 pattern="\d*"
//                 id="minAmount"
//                 placeholder="Min Amount"
//                 value={minAmount}
//                 onChange={(e) => setMinAmount(e.target.value)}
//                 className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
//               />
//             </div>
//           </div>
//           <div>
//             <label
//               htmlFor="maxAmount"
//               className="block text-gray-800 font-semibold text-sm"
//             >
//               Max Amount
//             </label>
//             <div className="mt-2">
//               <input
//                 id="maxAmount"
//                 placeholder="Max Amount"
//                 type="text"
//                 inputMode="numeric"
//                 pattern="\d*"
//                 value={maxAmount}
//                 onChange={(e) => setMaxAmount(e.target.value)}
//                 className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
//               />
//             </div>
//           </div>
//           <div>
//             <button
//               onClick={fetchPaymentsByDate}
//               className="block mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded focus:outline-none focus:shadow-outline"
//             >
//               {loading ? "Loading..." : "Apply Filter"}
//             </button>
//           </div>
//         </div>
//         <div className="bg-[#fdfcfc] border border-black flex  flex-col items-center justify-center p-3  rounded-lg ">
//           <h2 className="text-2xl font-bold mb-2">
//             Total Collection for {formattedDate}
//           </h2>
//           <p className="text-3xl">₹{totalCollection}</p>
//         </div>
//       </div>
//       <div className="w-full bg-white p-8 shadow-md rounded-md">
//         <h2 className="text-xl font-bold mb-2">Payments</h2>
//         {payments.length === 0 ? (
//           <div className="text-center py-8">
//             <p className="text-gray-500 text-lg">
//               No payments found for the selected date.
//             </p>
//             <img
//               src="/no_data2.jpg"
//               alt="No data"
//               height={200}
//               width={200}
//               className="mx-auto mt-4"
//               style={{ mixBlendMode: "multiply" }}
//             />
//           </div>
//         ) : (
//           <div className="flex flex-wrap -mx-4">
//             {payments.map((payment) => (
//               <div
//                 key={payment._id}
//                 className="w-full md:w-1/2 lg:w-1/2 px-4 mb-4"
//               >
//                 <div className="bg-white border border-black p-4 text-xl rounded-md shadow flex justify-between items-center">
//                   <div className="flex justify-between">
//                     <div className="flex items-center">
//                       <img
//                         src={payment.loan.member.profilePicture}
//                         alt={payment.loan.member.name}
//                         className="w-10 h-10  rounded-full mr-4"
//                       />
//                     </div>
//                     <div className="">
//                       <p className="text-black text-2xl">
//                         {payment.loan.member.name}
//                       </p>
//                       <p className="text-black text-base ">
//                         {format(parseISO(payment.date), "dd-MM-yyyy")}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex w-1/2 justify-evenly items-center flex-row-reverse ">
//                     <p className="text-lg font-semibold">₹{payment.amount}</p>
//                     <div className="w-1/2 justify-between items-end scale-125">
//                       {payment.paymentType === "Cash" ? (
//                         <img src="/cash.png" alt="Cash" className="w-8 h-8" />
//                       ) : (
//                         <img src="/gpay.png" alt="GPay" className="w-8 h-8" />
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentsPage;
