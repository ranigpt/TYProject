const RecuiterPostData = require('../../models/RecuiterPostData');
const cloudinary = require('../../config/Cloudinary');

const createPost = async (req, res) => {
  try {
    const { title, description, location, experience, skills, salary, jobType, jobCategory , jobLink } = req.body;

    let parsedSkills;
try {
  parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;
} catch (error) {
  console.error('Skills JSON Parse Error:', error);
  return res.status(400).json({ error: 'Invalid skills format' });
}

    let imageUrl = ''; // Default empty string for image

    if (req.file) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'job_posts',
        });
        imageUrl = uploadResult.secure_url;
      } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        return res.status(500).json({ error: 'Image upload failed' });
      }
    }
    

    const newPost = new RecuiterPostData({
      title,
      description,
      image: imageUrl, // Store empty string if no image
      location,
      experience,
      jobLink,
      jobType,
      jobCategory,
      skills: parsedSkills,
      salary,
      RecuiterId: req.user.id,
    });

    await newPost.save();
    return res.status(201).json({ message: 'Job post created successfully!', post: newPost });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createPost };
