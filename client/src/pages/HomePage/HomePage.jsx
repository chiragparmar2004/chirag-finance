import { useEffect, useState } from "react";
import MemberList from "../../components/MemberList/MemberList";
import apiRequest from "../../lib/apiRequest";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // Function to fetch members from the API
    const fetchMembers = async () => {
      try {
        const response = await apiRequest().get("/user/allMembers"); // Update the API endpoint as needed
        console.log(response.data.data);
        setMembers(response.data.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Search members by name or mobile number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <MemberList members={filteredMembers} />
    </div>
  );
};

export default HomePage;
