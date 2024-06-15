import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import toast from "react-hot-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);
    console.log(formData);
    const username = formData.get("username");
    const password = formData.get("password");
    try {
      console.log(username);
      const res = await apiRequest().post("/auth/login", {
        username,
        password,
      });

      console.log(res);
      // localStorage.setItem("user", JSON.stringify(res.data));
      updateUser(res.data);
      toast.success("Login successfully");

      navigate("/");
    } catch (err) {
      //   setError(err.response);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full   flex items-center justify-center  ">
      <div className="bg-[#454545] p-8 rounded-lg shadow-custom-inset w-full max-w-md ">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-white mb-2">Password</label>
            <input
              type="password"
              value={password}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#006fff] text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
          {error && <span>{error}</span>}
          <Link to="/register" className="text-white">
            {"Don't"} you have an account? register
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
