 
 
 
 
 export const fetchProfileDetails = async () => {
    try {
      console.log("Fetching profile details...");
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User is not logged in.");
        return "/default-profile.png"; // Ensure it always returns a string
      }
  
      const response = await axios.get("http://localhost:3000/profile/create", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("Fetched Profile Data:", response.data);
  
      // Ensure response.data.Dp is a valid string
      return typeof response.data.Dp === "string" && response.data.Dp.length > 0
        ? `http://localhost:3000${response.data.Dp}`
        : "/default-profile.png";
    } catch (error) {
      console.error("Error fetching profile:", error.message);
      return "/default-profile.png";
    }
  };
  
  
  export const fetchProfileImage = async (dpUrl, setProfileDp) => {
    if (!dpUrl || typeof dpUrl !== "string" || dpUrl.startsWith("blob:")) return;  
    // Pehle check kar lo ki dpUrl ek valid string hai ya nahi
    console.log("dpUrl type:", typeof dpUrl, "Value:", dpUrl);

    console.log("Fetching profile image:", dpUrl);
  
    try {
      const response = await fetch(dpUrl, { mode: "cors" });
      if (!response.ok) throw new Error("Network response was not ok");
  
      const blob = await response.blob();
      const objectURL = URL.createObjectURL(blob);
      console.log("Image fetched successfully:", objectURL);
      setProfileDp(objectURL);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };
  