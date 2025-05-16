const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
//const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const http = require('http');
const session = require('express-session');
const passport = require('passport');
const { Server } = require('socket.io');
require('dotenv').config();

const ReCreatePost = require("./routes/recruiterRoute/postjob.route")


const app = express();
const port = 3000;

// Import routes and configurations
const Routeregister = require('./routes/Register.route');
const LoginIn = require('./routes/Login.route');
const PostAPI = require('./routes/Post.route');
const GoogleRoute = require('./routes/Google.route');
const configurePassport = require('./config/Passpost');
const Logout = require('./routes/Logout');
const PostDelete = require('./routes/Delete.route');
const PostEdit = require('./routes/updatepost');
const like = require('./routes/Likes.route');
//const verifyEmail = require('./Utils/Verify');
const PostModel = require('./models/PostData');
const { initSocket, getIO } = require('./config/socketconfig');
const Commentroute = require('./routes/postcomments.route');
const ReCommentroute = require('./routes/recruiterRoute/ReComments');
const RegetComments = require('./routes/recruiterRoute/RegetComment.route');
const RegetReactions = require('./routes/recruiterRoute/ReactionComment');
const ReProfile = require('./routes/recruiterRoute/profilefetch');
const ReNameUpdate = require('./routes/recruiterRoute/ReName');
const ReUpdateProfile = require('./routes/recruiterRoute/updateprofile')
const getComments = require('./routes/getcomment.route');
const profileget = require('./routes/profile.route')
const updateprofile = require('./routes/profile.route')
const RecruiterRegister = require('./routes/recruiterRoute/RRegister.route')
const RecruiterLogin = require('./routes/recruiterRoute/reLogin.route')
const recruiterRoutes = require('./routes/recruiterRoute/FetchPost.route');
const userForgetPassword = require('./routes/userpasswordforget');
const ForgetPasswordRoutes = require('./routes/recruiterRoute/ForgetPassword.route');
const VerifyAndResend = require('./routes/recruiterRoute/ReVerification.route')
const verifyAndResndUser = require('./routes/verifyotpuser');
const UserUpadateDp = require('./routes/userDp');
const  UpdatePhoneNumber = require('./routes/PhoneUpdateUser')
const ProfileSee = require('./routes/profileSeeUser');
const Rating = require('./routes/RatingRouteController')
const SearchRoute = require('./routes/Search');
const suggestions = require('./routes/suggetions');

console.log("Static path:", path.join(__dirname, 'uploads'));

// Database connection
const url = 'mongodb+srv://rani2004g2:FMHdCHJtrhNheSq8@cluster0.jpnmd.mongodb.net/Blueskizz';
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000, // Increase timeout to 20 seconds

  })
  .then(() => {
    console.log('Connected to the Database');
  })
  .catch((e) => {
    console.error('Database connection error:', e.message);
  });


app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: ["http://localhost:5173", "https://accounts.google.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],//edited

  credentials: true, // enable set cookie
}));

// Serve uploads folder
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/uploads", express.static("uploads", {
  setHeaders: (res, path) => {
    res.set("Access-Control-Allow-Origin", "http://localhost:5173");
    res.set("Access-Control-Allow-Credentials", "true");
    res.set("Content-Type", "image/jpeg"); // Adjust based on image type
  },
}));


app.use((req, res, next) => {
  res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");
  next();
});

app.use(mongoSanitize());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images")));

// session for signIN

app.use(session({
    secret : "kikijkdwndefjbefbhfjwnqeuwhejwbfn72662535425hsgd",
    resave : false,
    saveUninitialized : true,
    cookie: { secure: false }, // Use `true` in production with HTTPS
}))

app.use(passport.initialize());
app.use(passport.session());
configurePassport();



// Socket.io setup
const server = http.createServer(app);
const io = initSocket(server);

// Routes
app.use('/auth', GoogleRoute); // Google authentication
app.use('/register', Routeregister); // User registration
//app.use('/verify', verifyEmail); // Email verification
app.use('/login', LoginIn); // User login
app.use('/post', PostAPI(io)); // Post-related routes
app.use('/post/delete', PostDelete(io)); // Post deletion
app.use('/post/update', PostEdit(io)); // Post editing
app.use('/comments', Commentroute(io)); // Comments route
app.use('/getcomments', getComments); // Get comments
 app.use('/profile' , profileget); // Profile route
 app.use('/user/dp' , UserUpadateDp)
 app.use('/verifyUser' , verifyAndResndUser)
app.use('/api', like(io)); // Like functionality
app.use('/phone' , UpdatePhoneNumber) //user
app.use('/profileSee', ProfileSee)
app.use('/rating' , Rating)


// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Static file serving
app.use('/logout', Logout); // User logout
app.use('/register/signupRecruiter' , RecruiterRegister)
app.use('/recruiter/login/' , RecruiterLogin)
app.use('/verifyRecuiter' , VerifyAndResend);
app.use('/recruiter/forget', ForgetPasswordRoutes); // Corrected path

app.use('/user/forget', userForgetPassword); // Corrected path

// Example post retrieval endpoint
app.get('/post/getAll', async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate('User_Id', 'Name Dp Email')
      .sort({ createdAt: -1 });

    // Ensure profile images have a full URL
    const updatedPosts = posts.map(post => {
      if (post.User_Id?.Dp) {
        // Check if Dp is already a full URL
        if (!post.User_Id.Dp.startsWith("http")) {
          post.User_Id.Dp = `http://localhost:3000/${post.User_Id.Dp.replace(/^\//, '')}`;
        }
      }

      console.log("Backend Dp:", post.User_Id?.Dp);
      return post;
    });

    res.json({ posts: updatedPosts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
});

app.use("/api/search", SearchRoute);
app.use("/api/jobs" , suggestions)



// Default endpoint
app.get('/', (req, res) => {
  res.json('Hello! Everything is set up correctly.');
});


//recuiter Routes

app.use('/Reapi', ReCreatePost)
app.use('/recuiter', recruiterRoutes);
app.use('/Recomments', ReCommentroute(io)); // Comments route
app.use('/Regetcomments', RegetComments); // Get comments
app.use('/Reactions', RegetReactions); // Get comments
app.use('/ReProfile', ReProfile); // Get comments
app.use('/ReUpdateProfile', ReUpdateProfile); // Get comments
app.use('/ReUpdateName', ReNameUpdate)
// Socket.io connection
io.on('connection', (socket) => {
  console.log('A User Connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});



// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});