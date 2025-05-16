router.put('/status', Authetication, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user._id;
    const profilePicture = `/uploads/${req.file.filename}`.replace(/\\/g, "/");

    const updatedUser = await User.findByIdAndUpdate(userId, { Dp: profilePicture }, { new: true });

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile picture updated", Dp: updatedUser.Dp });
  } catch (err) {
    console.error("Error updating profile picture:", err);
    res.status(500).json({ message: "Error updating profile picture." });
  }
});//emplyee