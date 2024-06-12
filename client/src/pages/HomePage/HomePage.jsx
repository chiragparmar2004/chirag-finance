import { useState } from "react";
import MemberList from "../../components/MemberList/MemberList";
import axios from "axios";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy member data, replace with actual member data from your backend or state
  const members = [
    { id: 1, name: "John Doe", mobile: "123-456-7890" },
    { id: 2, name: "Jane Smith", mobile: "987-654-3210" },
    { id: 3, name: "Alice Johnson", mobile: "555-555-5555" },
    { id: 4, name: "Bob Brown", mobile: "111-111-1111" },
    { id: 5, name: "Charlie Black", mobile: "222-222-2222" },
    { id: 6, name: "Dave White", mobile: "333-333-3333" },
    // Add more members as needed
  ];

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">HomePage</h1>
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Search members by name or mobile number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => {
            imag();
          }}
        >
          Click me
        </button>
      </div>
      <MemberList members={filteredMembers} />
    </div>
  );
};

export default HomePage;
