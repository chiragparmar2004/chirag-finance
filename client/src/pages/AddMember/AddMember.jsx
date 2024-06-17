import apiRequest from "../../lib/apiRequest";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddMember = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const inputs = Object.fromEntries(formData);
      const res = await apiRequest().post("/user/add_member", {
        name: inputs.name,
        mobileNumber: inputs.mobileNumber,
      });
      toast.success("Member added successfully");
      navigate("/home_page");
    } catch (error) {
      console.log(error, "error in addMember");
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full">
      <div className="bg-[#454545] rounded-lg shadow-custom-inset px-8 pt-6 pb-8 w-full max-w-md scale-125">
        <h2 className="text-2xl font-bold mb-10 text-center text-black">
          Add Member
        </h2>

        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="flex items-center justify-center mb-6">
            <div className="flex flex-col-reverse w-full">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Full Name"
                className="peer outline-none border pl-2 py-1 duration-500 border-black focus:border-dashed focus:border-blue-700 bg-inherit w-full placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 focus:rounded-md"
              />
              <span className="pl-2 duration-500 opacity-0 peer-focus:opacity-100 -translate-y-5 peer-focus:translate-y-0 text-blue-700">
                Full Name
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center mb-6">
            <div className="flex flex-col-reverse w-full">
              <input
                id="mobileNumber"
                name="mobileNumber"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                placeholder="Mobile"
                className="peer outline-none border pl-2 py-1 duration-500 border-black focus:border-dashed focus:border-blue-700 bg-inherit w-full placeholder:duration-500 placeholder:absolute focus:placeholder:pt-10 focus:rounded-md"
              />
              <span className="pl-2 duration-500 opacity-0 peer-focus:opacity-100 -translate-y-5 peer-focus:translate-y-0 text-blue-700">
                Mobile
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-full  cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg
border-blue-600
border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMember;
