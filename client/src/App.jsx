import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import AddMember from "./pages/AddMember/AddMember";
import MemberLoanPage from "./pages/MemberLoanPage/MemberLoanPage";
import LoanDetailPage from "./pages/LoanDetailPage/LoanDetailPage";
import AddLoan from "./pages/AddLoan.jsx/AddLoan";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/LoginPage/Login";
import Register from "./pages/RegisterPage/Register";
import PaymentsPage from "./pages/PaymentsPage/PaymentPage";
import DailyCollectionSettlementPage from "./pages/DailyCollectionSettlementPage/DailyCollectionSettlementPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/Add_Loan",
          element: <AddLoan />,
        },
        {
          path: "/Add_Member",
          element: <AddMember />,
        },
        {
          path: "/member/:id",
          element: <MemberLoanPage />,
        },
        {
          path: "/loan/:loanId",
          element: <LoanDetailPage />,
        },
        {
          path: "/Dashboard",
          element: <Dashboard />,
        },
        {
          path: "/payments",
          element: <PaymentsPage />,
        },
        {
          path: "/settlements",
          element: <DailyCollectionSettlementPage />,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
