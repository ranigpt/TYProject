BlueSkillz - Unleash Your Potential 👷‍♂️🛠️

Video Link :- [https://www.linkedin.com/posts/rani-gupta2_mern-fullstackdeveloper-bluecollarjobs-activity-7329057844408799232-OU9E?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD8WwtgBbPp_H6H7ANfkZ89zVEYiXmvLq-M](url)

BlueSkillz is a professional networking platform built specifically for blue-collar workers to showcase their skills, work experience, and achievements using multimedia content. Think of it as LinkedIn for blue-collar professionals, with a focus on visibility, empowerment, and career growth.

🚀 Features
🔐 User Authentication – Secure login & registration using JWT

🧑‍💼 Profile Management – Showcase skills, experience, qualifications, and more

📸 Multimedia Posts – Share work, achievements, or job openings via text, images, or video

💬 Live Comments – Real-time commenting on posts using WebSockets

📢 Job Posting – Recruiters or companies can post vacancies with role details, salary, location, etc.

🔎 Smart Job Matching – Helps users find relevant opportunities based on their profile

📱 Responsive Design – Optimized for both desktop and mobile users

🧰 Tech Stack
🔹 Frontend
React.js

Tailwind CSS

React Router DOM

🔹 Backend
Node.js

Express.js

MongoDB + Mongoose

WebSocket (socket.io) for real-time updates

🔹 Dev Tools
Git & GitHub

Postman (for API testing)

MongoDB Atlas (cloud database)

📁 Project Structure
bash
Copy
Edit
blueskillz/
│
├── client/               # Frontend (React)
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.jsx
│
├── server/               # Backend (Node/Express)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   └── server.js
│
├── README.md
└── package.json
🌟 Unique Value
Unlike generic job portals, BlueSkillz is custom-built for workers in roles like:

Hotel Staff (waiters, cleaners)

Household Help (maids, nannies)

School Support Staff

Factory, Construction, and other skilled trade workers

It empowers these workers to gain digital presence, get discovered by recruiters, and grow their careers.

✨ Future Enhancements
Profile verification badges

Voice/video resume uploads

Recruiter dashboard and analytics

Multi-language support

Recommendation & endorsement system

🧑‍💻 Developer's Note
I built this project to bridge the gap between skilled blue-collar workers and job opportunities. Implementing real-time WebSocket communication for live comments was a fun challenge that helped me learn a lot about real-time systems.

📦 How to Run Locally
Clone the Repo
bash
Copy
Edit
git clone https://github.com/yourusername/blueskillz.git
cd blueskillz
Run Backend
bash
Copy
Edit
cd server
npm install
npm start
Run Frontend
bash
Copy
Edit
cd client
npm install
npm start
Make sure to create a .env file for both frontend and backend with necessary variables like:

env
Copy
Edit
# Backend
JWT_SECRET = your
CLIENT_ID = google client id your

ClIENT_SECRET = your
     
COMPANY_SECRET = your
CLOUD_NAME= your cloudinary name
CLOUDINARY_API_KEY = youapi
CLOUDINARY_API_SECRET= yourapi
SMTP_EMAIL= your email 
SMTP_PASSWORD= your app password
PORT=5000
📬 Contact
Feel free to connect with me:

📧 Email: rani2004g2@gmail.com

💼 LinkedIn: https://www.linkedin.com/in/rani-gupta2/
