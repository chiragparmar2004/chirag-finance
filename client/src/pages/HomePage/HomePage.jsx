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
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          All Members
        </h2>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
            >
              <path
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                stroke="currentColor"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            required=""
            placeholder="Search members by name"
            className="block w-full p-4 py-5 ps-10 text-lg text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            id="default-search"
          />
        </div>
        {/* <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Search members by name or mobile number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        /> */}
      </div>

      <MemberList members={filteredMembers} />
    </div>
  );
};

export default HomePage;
