import apiRequest from "../../lib/apiRequest";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddMember = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Handle form submission logic here
      const formData = new FormData(e.target);
      const inputs = Object.fromEntries(formData);
      const res = await apiRequest().post("/user/add_member", {
        name: inputs.name,
        mobileNumber: inputs.mobileNumber,
      });
      toast.success("Member added successfully");
      navigate("/");
    } catch (error) {
      console.log(error, "error in addMember");
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full">
      <div className="bg-[#454545] rounded-lg shadow-custom-inset  px-8 pt-6 pb-8 w-full max-w-md ">
        <h2 className="text-2xl font-bold mb-10 text-center text-black">
          Add Member
        </h2>

        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-black font-bold md:text-right mb-1 md:mb-0 pr-4">
                Full Name
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className=" appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-[#3b82f6]"
                name="name"
                type="text"
              />
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-black font-bold md:text-right mb-1 md:mb-0 pr-4">
                Mobile
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className=" appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-[#3b82f6]"
                name="mobileNumber"
                type="Number"
                inputMode="numeric"
                pattern="[0-9]"
              />
            </div>
          </div>

          <div className="md:flex md:items-center">
            <div className="md:w-1/3"></div>
            <div className="md:w-2/3">
              <button
                className="shadow bg-[#3b82f6] hover:bg-[#3b82f6] focus:shadow-outline focus:outline-none text-black font-bold py-2 px-4 rounded"
                type="submit"
              >
                Add Member
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMember;
