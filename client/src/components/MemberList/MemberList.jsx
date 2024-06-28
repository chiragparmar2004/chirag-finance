import { useNavigate } from "react-router-dom";
import "./MemberList.css";

const MemberList = ({ members }) => {
  const navigate = useNavigate();

  const handleMemberClick = (id) => {
    navigate(`/member/${id}`);
  };

  if (members.length === 0) {
    return (
      <div className="p-8 rounded-md text-center">
        <img
          src="/No-data-rafiki.png"
          alt="No data found"
          className="mx-auto mb-4"
        />
        <p className="text-gray-500">No members found.</p>
      </div>
    );
  }

  return (
    <div className="p-8 rounded-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.map((member) => (
          <div
            key={member._id}
            className="member-card p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => handleMemberClick(member._id)}
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full mb-4 flex items-center justify-center">
                <img
                  src={member.profilePicture}
                  alt={member.name}
                  className="rounded-full scale-150"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                {member.name}
              </h3>
              <p className="text-gray-500 mb-4">{member.mobile}</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
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
