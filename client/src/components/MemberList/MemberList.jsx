import { useNavigate } from "react-router-dom";

const MemberList = ({ members }) => {
  const navigate = useNavigate();

  const handleMemberClick = (id) => {
    navigate(`/member/${id}`);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">All Members</h2>
      <ul>
        {members.map((member) => (
          <li
            key={member.id}
            className="border-b border-gray-200 py-2 cursor-pointer"
            onClick={() => handleMemberClick(member.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-gray-500">{member.mobile}</p>
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 rounded">
                View Details
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberList;
