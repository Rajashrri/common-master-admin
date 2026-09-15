import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import UserProfilesSetting from "./pages/UserProfilesSetting";

import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { getMyPermissionsApi } from "./api/privilegeApi";
import { useEffect } from "react";

import ResetPasswordPage from "./pages/AuthPages/ResetPasswordPage";
import ForgetPasswordPage from "./pages/AuthPages/ForgetPasswordPage";
import OtpPage from "./pages/AuthPages/OtpPage";

import BlogCatogery from "./pages/Blog/BlogCatogery";
import BlogTable from "./pages/Blog/BlogTable";

import AddBlog from "./pages/Blog/AddBlog";
import EditBlog from "./pages/Blog/EditBlog";
import SeoBlog from "./pages/Blog/SeoBlog";

import ProductCatogery from "./pages/Product/ProductCategory";
import ProjectCatogery from "./pages/Project/ProjectCategory";

import AddProject from "./pages/Project/AddProject";
import ListProject from "./pages/Project/ProjectList";
import EditProject from "./pages/Project/EditProject";
import EditProjectSeo from "./pages/Project/EditProjectSeo";

import ProductSubCatogery from "./pages/Product/ProductSubCategory";

import AddProduct from "./pages/Product/AddProduct";
import ListProduct from "./pages/Product/Product";
import EditProduct from "./pages/Product/EditProduct";
import EditProductSeo from "./pages/Product/EditProductSeo";

import ServiceCategory from "./pages/Service/ServiceCategory";

import AddService from "./pages/Service/AddService";
import ServiceList from "./pages/Service/ServiceList";

import EditService from "./pages/Service/EditService";

import EditServiceSeo from "./pages/Service/EditServiceSeo";

import NewsCategory from "./pages/News/NewsCategory";

import AddNews from "./pages/News/AddNews";
import NewsList from "./pages/News/NewsList";
import EditNews from "./pages/News/EditNews";
import NewsSeo from "./pages/News/NewsSeo";

import GalleryCategory from "./pages/Gallery/GalleryCategory";
import AddGallery from "./pages/Gallery/AddGallery";
import GalleryList from "./pages/Gallery/GalleryList";
import EditGallery from "./pages/Gallery/EditGallery";

import VideoCategory from "./pages/Video/VideoCategory";
import AddVideo from "./pages/Video/AddVideo";
import EditVideo from "./pages/Video/EditVideo";
import VideoList from "./pages/Video/VideoList";
import VideoSeo from "./pages/Video/VideoSeo";

import EventCategory from "./pages/Event/EventCategory";

import AddEvent from "./pages/Event/AddEvent";
import EventList from "./pages/Event/EventList";
import EditEvent from "./pages/Event/EditEvent";
import EventSeo from "./pages/Event/EventSeo";
import LinkList from "./pages/Link/LinkManagement";
import PdfManagement from "./pages/Pdf/PdfManagement";

import JobCategory from "./pages/Job/JobCategory";

import AddJob from "./pages/Job/AddJob";
import JobList from "./pages/Job/JobList";
import EditJob from "./pages/Job/EditJob";
import JobSeo from "./pages/Job/JobSeo";

import FaqCategory from "./pages/Faq/FaqCategory";
import AddFaq from "./pages/Faq/AddFaq";
import FaqList from "./pages/Faq/FaqList";
import EditFaq from "./pages/Faq/EditFaq";

import AddTestimonial from "./pages/Testimonial/AddTestimonial";
import ListTestimonial from "./pages/Testimonial/Testimonial";
import EditTestimonial from "./pages/Testimonial/EditTestimonial";

import AddClientele from "./pages/Clientele/AddClientele";
import ClienteleList from "./pages/Clientele/ClienteleList";
import EditClientele from "./pages/Clientele/EditClientele";

import AddCoreTeam from "./pages/Team/AddTeam";
import CoreTeamList from "./pages/Team/TeamList";
import EditCoreTeam from "./pages/Team/EditTeam";

import RoleMasterList from "./pages/RoleMaster/RoleMasterList";
import AddUser from "./pages/User/AddUser";
import ListUser from "./pages/User/UserList";
import EditUser from "./pages/User/EditUser";

import Privileges from "./pages/User/Privileges";

import Contact from "./pages/List/contact";
import Career from "./pages/List/career";
import Newsletter from "./pages/List/Newsletter";

import AuthGuard from "./components/AuthGuard";

export default function App() {
  useEffect(() => {
    const loadPermissions = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) return;

      try {
        const { data } = await getMyPermissionsApi();

        console.log(data);

        localStorage.setItem(
          "permissions",
          JSON.stringify(data.permissions || []),
        );

        localStorage.setItem("isAdmin", JSON.stringify(data.isAdmin));
      } catch (err: any) {
        console.log("Permission Error:", err.response?.data);
        console.log("Status:", err.response?.status);
      }
    };

    loadPermissions();
  }, []);

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route
            path="/"
            element={
              <AuthGuard>
                <AppLayout />
              </AuthGuard>
            }
          >
            <Route index element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/profile-setting" element={<UserProfilesSetting />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/add-blog" element={<AddBlog />} />

            <Route path="/edit-blog/:id" element={<EditBlog />} />
            <Route path="/seo/:id" element={<SeoBlog />} />
            <Route path="/blog-catogery" element={<BlogCatogery />} />
            <Route path="/blog" element={<BlogTable />} />
            <Route path="/add-Testimonial" element={<AddTestimonial />} />

            <Route path="/product-catogery" element={<ProductCatogery />} />
            <Route
              path="/product-subcatogery"
              element={<ProductSubCatogery />}
            />
            <Route path="/add-project" element={<AddProject />} />
            <Route path="/list-project" element={<ListProject />} />
            <Route path="/project-catogery" element={<ProjectCatogery />} />
            <Route path="/project-seo/:id" element={<EditProjectSeo />} />
            <Route path="/edit-project/:id" element={<EditProject />} />

            <Route path="/service-category" element={<ServiceCategory />} />

            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/list-product" element={<ListProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/product/seo/:id" element={<EditProductSeo />} />
            <Route path="/add-service" element={<AddService />} />
            <Route path="/list-service" element={<ServiceList />} />
            <Route path="/edit-service/:id" element={<EditService />} />
            <Route path="/faq-category" element={<FaqCategory />} />

            <Route path="/add-faq" element={<AddFaq />} />
            <Route path="/list-faq" element={<FaqList />} />
            <Route path="/edit-faq/:id" element={<EditFaq />} />

            <Route path="/news-category" element={<NewsCategory />} />
            <Route path="/add-event" element={<AddEvent />} />

            <Route path="/event-category" element={<EventCategory />} />
            <Route path="/list-event" element={<EventList />} />
            <Route path="/edit-event/:id" element={<EditEvent />} />
            <Route path="/event-seo/:id" element={<EventSeo />} />

            <Route path="/add-news" element={<AddNews />} />

            <Route path="/list-news" element={<NewsList />} />
            <Route path="/edit-news/:id" element={<EditNews />} />
            <Route path="/news-seo/:id" element={<NewsSeo />} />

            <Route path="/job-category" element={<JobCategory />} />
            <Route path="/add-job" element={<AddJob />} />

            <Route path="/list-job" element={<JobList />} />
            <Route path="/edit-job/:id" element={<EditJob />} />
            <Route path="/job-seo/:id" element={<JobSeo />} />

            <Route path="/service/seo/:id" element={<EditServiceSeo />} />

            <Route path="/list-Testimonial" element={<ListTestimonial />} />
            <Route path="/edit-testimonial/:id" element={<EditTestimonial />} />

            <Route path="/add-clientele" element={<AddClientele />} />

            <Route path="/list-clientele" element={<ClienteleList />} />
            <Route path="/edit-clientele/:id" element={<EditClientele />} />

            <Route path="/add-team" element={<AddCoreTeam />} />

            <Route path="/list-team" element={<CoreTeamList />} />
            <Route path="/edit-team/:id" element={<EditCoreTeam />} />

            <Route path="/list-link" element={<LinkList />} />
            <Route path="/list-pdf" element={<PdfManagement />} />

            <Route path="/gallery-category" element={<GalleryCategory />} />
            <Route path="/add-gallery" element={<AddGallery />} />

            <Route path="/list-gallery" element={<GalleryList />} />
            <Route path="/edit-gallery/:id" element={<EditGallery />} />
            <Route path="/video-category" element={<VideoCategory />} />

            <Route path="/video-seo/:id" element={<VideoSeo />} />
            <Route path="/add-video" element={<AddVideo />} />
            <Route path="/list-video" element={<VideoList />} />
            <Route path="/edit-video/:id" element={<EditVideo />} />

            <Route path="/contact-list" element={<Contact />} />
            <Route path="/career-list" element={<Career />} />
            <Route path="/newsletter-list" element={<Newsletter />} />

            <Route path="/rolemaster-list" element={<RoleMasterList />} />

            <Route path="/add-user" element={<AddUser />} />
            <Route path="/list-user" element={<ListUser />} />

            <Route path="/edit-user/:id" element={<EditUser />} />
            <Route path="/set-privileges/:roleId" element={<Privileges />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/forget-password" element={<ForgetPasswordPage />} />
          <Route path="/otp" element={<OtpPage />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer
        className="z-100"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  );
}
