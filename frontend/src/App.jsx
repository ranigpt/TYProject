import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import UserOrRecuiter from "./pages/UserOrRecuiter";
import MainPage from "./pages/MainPage";
import PrivateAuthCheck from "./FrontMinddleware/PrivateAuthCheck";
import RegistrationRecuiter from "./pages/RecuiterRegister";
import RecuiterProfile from "./pages/RecuiterProfile";
import RecuiterLogin from "./pages/RecuiterLogin";
import RecuiterPage from "./pages/RecuiterPage";
import JobsList from "./pages/jobsList";
import VerifyOTP from "./pages/verifyOtpRe";
import ForgotPassword from "./pages/ForgetPassword";
import ReForgetVerifyOTP from "./pages/ReForgetVerifyOTP"
import ResetPassword from "./pages/ResentPassword";
import Userverify from "./pages/UserVerifyOTP";
import UserForgetPassword from "./pages/UserForgetPassword";
import UserForgetPasswordToOtpVerify from "./pages/userForgetotpverify"
import UserForgetPassReset from "./pages/userResetpassword"
import UpdatePhone from './pages/updatephoneuser'
import VerifyPhoneOTPUser from './pages/phoneOTPVerify'
import ProfileCompo from './Components/ProfileCompo'
import UserProfile from './pages/UserProfileSee'
import RecuiterProfilepage from './pages/RecuiterProfilepage'
import RecuiterProfileSeeAll from './pages/RecuiterSeeALLProfile'
import SearchResults from "./Components/SearchResult";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<UserOrRecuiter />} />
        <Route path="/login/Employer" element={<RecuiterLogin />} />
        <Route path="/login/Employee" element={<Login />} />
        <Route path="/verify-otp-user" element={<Userverify />} />  {/* ✅ Add this route */}
         <Route path="/forget-password-user" element={<UserForgetPassword />} />  {/* ✅ Add this route */}
          <Route path="/forget-otp-verify-user" element={<UserForgetPasswordToOtpVerify />} />  {/* ✅ Add this route */}
            <Route path="/reset-password-user" element={<UserForgetPassReset />} />  {/* ✅ Add this route */}
      <Route path="/update-phone" element={<UpdatePhone />} />  {/* ✅ Add this route */}
      <Route path="/verify-phone-otp-user" element={<VerifyPhoneOTPUser />} />  {/* ✅ Add this route */}
      <Route path="/user/profileSee/:email" element={<UserProfile />} />
      <Route path="/search" element={<SearchResults />} />


       {/* ALL RecuiterPaths */}
        <Route path="/Employer/Login" element={<RegistrationRecuiter />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />  {/* ✅ Add this route */}

       <Route path='/forgot-password' element={<ForgotPassword />} /> {/* ✅ Add this route */}

       <Route path='/reset-otp' element={<ReForgetVerifyOTP />} /> {/* ✅ Add this route */}
       <Route path='/reset-password' element={<ResetPassword />} /> {/* ✅ Add this route */}
        {/* Recruiter Dashboard */}
        <Route path="/Employer/*" element={<RecuiterPage />} />
        <Route path='/Employer/profile' element={<RecuiterProfilepage/>}/>
        <Route path='/Employer/profile/:email' element={<RecuiterProfileSeeAll/>}/>

        {/* Protected Profile Route */}
        <Route
          path="/profile"
          element={
            <PrivateAuthCheck>
              <Login />
            </PrivateAuthCheck>
          }
        />

        {/* Jobs List Route */}
        <Route path="/jobs" element={<JobsList />} />

          {/* Profile Route with Email */}
          <Route path="/user/profile/:email" element={<ProfileCompo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
