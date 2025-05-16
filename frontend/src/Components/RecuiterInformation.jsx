import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil } from "lucide-react";
import useReProfilefetch from "../hooks/useReProfileFetch";

function RecruiterInformation() {
  const { recruiter, loading, error, refetch } = useReProfilefetch();

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Recruiter Dashboard</h2>
      

      <div className="mt-4 space-y-3">
        {/* <p>{recruiter._id}</p> */}
        <ProfileField label="Phone" value={recruiter?.Phone} field="Phone" recruiterId={recruiter?._id} onUpdate={refetch} />
        <ProfileField label="Status" value={recruiter?.Status} field="Status" recruiterId={recruiter?._id} onUpdate={refetch} />
        <ProfileField label="Company" value={recruiter?.CompanyName} field="CompanyName" recruiterId={recruiter?._id} onUpdate={refetch} />
        <ProfileField label="Designation" value={recruiter?.Designation} field="Designation" recruiterId={recruiter?._id} onUpdate={refetch} />
        <ProfileField label="Industry" value={recruiter?.Industry} field="Industry" recruiterId={recruiter?._id} onUpdate={refetch} />
        <ProfileField label="Experience" value={recruiter?.Experience ? `${recruiter?.Experience} years` : null} field="Experience" recruiterId={recruiter?._id} onUpdate={refetch} />
        <ProfileField label="Hiring Location" value={recruiter?.HiringLocation} field="HiringLocation" recruiterId={recruiter?._id} onUpdate={refetch} />
      </div>

      <button className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4">
        Manage Profile
      </button>
    </div>
  );
}


// ✅ Updated ProfileField Component
const ProfileField = ({ label, value, field, recruiterId, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(value || "");
  const [isSaving, setIsSaving] = useState(false);


  const handleUpdate = async () => {
    console.log("Attempting to update:", { field, newValue });

    if (newValue === value) {
        console.log("No changes detected, skipping update.");
        setIsEditing(false);
        return;
    }

    setIsSaving(true);

    try {
        const response = await axios.put(
            `http://localhost:3000/ReUpdateProfile/update/${recruiterId}`,
            { [field]: newValue }
        );

        console.log("Server Response:", response.data);

        if (response.status === 200) {
            console.log(`Successfully updated ${field}:`, response.data);
            onUpdate(); // Trigger a fresh fetch
            setNewValue(response.data[field]); // Update UI with new value
        }

        setIsEditing(false);
    } catch (error) {
        console.error("Update failed:", error.response?.data || error.message);
    } finally {
        setIsSaving(false);
    }
};


  return (
    <div className="flex justify-between items-center border-b pb-1">
      <p className="text-gray-700">
        <strong>{label}:</strong>{" "}
        {isEditing ? (
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        ) : (
          value ?? "null"
        )}
      </p>
      {isEditing ? (
        <button
          className="text-green-500 hover:text-green-700"
          onClick={handleUpdate}
          disabled={isSaving}
        >
          {isSaving ? "⏳" : "✅"}
        </button>
      ) : (
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={() => setIsEditing(true)}
        >
          <Pencil size={16} />
        </button>
      )}
    </div>
  );
};


export default RecruiterInformation;
