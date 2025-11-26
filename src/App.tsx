import "./App.css";
import Home from "./pages/Home/Home";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/components/Dashboard";
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import AccountSettings from "./pages/Dashboard/Settings/AccountSettings";
import ChatLayout from "./pages/Dashboard/Chat/ChatLayout";

import SingleNewsDetail from "./pages/Home/SingleNewsDetail";
import PreFooter from "./pages/Home/components/PreFooter";
import TermsOfService from "./pages/Home/TermsAndServices";

import FinancialGPT from "./pages/Dashboard/FinancialGPT/FinancialGPT";
import Charts from './pages/Dashboard/Charts/Charts';
import Watchlist from "./pages/Dashboard/WatchList/Watchlist";
import PredictionChat from "./pages/Dashboard/Predictions/PredictionChat";

import PrivateRoute from "./layouts/PrivateRoute";
import NotFound from "./pages/NotFound";
import { AuthLayout } from "./layouts/AuthLayout";
import { PublicLayout, PublicOnlyRoute } from "./layouts/PublicOnlyRoute";
import { SignIn } from "./pages/Auth/SignIn";
import { SignUp } from "./pages/Auth/Signup";
import { ForgotPassword } from "./pages/Auth/ForgotPassword";
import { ResetPassword } from "./pages/Auth/ResetPassword";
import NotificationDisclaimer from "./pages/Dashboard/Notifications/NotificationDisclaimer";
import Journal from "./pages/Dashboard/Journals/Journal";
import News from "./pages/Dashboard/News/News";
import Blog from "./pages/News/Blog";
import BlogDetail from "./pages/News/BlogDetail";
import { VerifyEmail } from "./pages/Auth/VerifyEmail";
import AfterCheckout from "./pages/Home/components/AfterCheckout";
// import { useAuthStore } from "./api/stores/auth-store";
import PostSignupPricing from "./pages/Home/Subscription/PostSignupPricing";


export default function App() {
  // const { user } = useAuthStore();
  // console.log('data of user', user)

  return (
    <div className="home-main mx-auto min-h-screen ">
      <Routes>
        {/* <ScrollToTop /> */}
        {/* ----- Public Routes ----- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />

          <Route
            path="/single-news-details"
            element={
              <>
                <SingleNewsDetail />
                <PreFooter />
              </>
            }
          />
          <Route path="/terms-services" element={
            <>
              <TermsOfService />
              <PreFooter />
            </>
          } />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/after-checkout" element={<AfterCheckout />} />
          <Route
            path="/post-signup-pricing"
            element={
              <PublicOnlyRoute>
                <PostSignupPricing />
              </PublicOnlyRoute>
            }
          />
        </Route>

        {/* ----- Auth Routes ----- */}
        <Route
          path="/auth"
          element={
            <PublicOnlyRoute>
              <AuthLayout />
            </PublicOnlyRoute>
          }
        >
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="changepassword" element={<ResetPassword />} />
          <Route path="verify-email" element={<VerifyEmail />} />
        </Route>

        {/* ----- Dashboard Routes ----- */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route path="predictions" element={<PredictionChat />} />
          <Route path="charts" element={<Charts />} />
          <Route path="news" element={<News />} />
          <Route path="journal" element={<Journal />} />
          <Route path="account-settings" element={<AccountSettings />} />
          <Route path="notification" element={<NotificationDisclaimer />} />

        </Route>

        <Route
          path="/dashboard/financial-gpt"
          element={
            <PrivateRoute>
              <ChatLayout>
                <FinancialGPT />
              </ChatLayout>
            </PrivateRoute>
          }
        />

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}