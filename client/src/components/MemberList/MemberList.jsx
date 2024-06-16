import { useNavigate } from "react-router-dom";

const MemberList = ({ members }) => {
  const navigate = useNavigate();

  const handleMemberClick = (id) => {
    navigate(`/member/${id}`);
  };

  return (
    <div className=" p-8 ">
      <h2 className="text-3xl font-bold text-blue-50  mb-6 text-center">
        All Members
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.map((member) => (
          <div
            key={member._id}
            className=" p-6 rounded-lg shadow-custom-inset    duration-300 cursor-pointer"
            onClick={() => handleMemberClick(member._id)}
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24   rounded-full mb-4 flex items-center justify-center">
                <img
                  src={member.profilePicture}
                  className="rounded-full scale-150  "
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-black">
                {member.name}
              </h3>
              <button className="bg-[#69b4ff]  text-[#e0ffff] font-bold py-2 px-4 rounded">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberList;
