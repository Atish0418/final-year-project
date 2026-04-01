import { createHashRouter, createRoutesFromElements, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import HomePage from "../pages/HomePage";
import StreamsPage from "../pages/StreamsPage";
import Explore3DPage from "../pages/Explore3DPage";
import DepartmentDetailsPage from "../pages/DepartmentDetailsPage";
import DepartmentsPage from "../pages/DepartmentsPage";
import FutureJobsPage from "../pages/FutureJobsPage";
import CompareCoursesPage from "../pages/CompareCoursesPage";
import QuizPage from "../pages/QuizPage";
import QuizResultPage from "../pages/QuizResultPage";
import FavoritesPage from "../pages/FavoritesPage";
import ParentModePage from "../pages/ParentModePage";
import AboutPage from "../pages/AboutPage";
import EngineeringStreamPage from "../pages/EngineeringStreamPage";
import ArtsScienceStreamPage from "../pages/ArtsScienceStreamPage";
import CommerceStreamPage from "../pages/CommerceStreamPage";
import MedicalStreamPage from "../pages/MedicalStreamPage";
import ParamedicalStreamPage from "../pages/ParamedicalStreamPage";
import AgricultureStreamPage from "../pages/AgricultureStreamPage";
import LawStreamPage from "../pages/LawStreamPage";
import DesignMediaStreamPage from "../pages/DesignMediaStreamPage";
import ManagementStreamPage from "../pages/ManagementStreamPage";
import DiplomaStreamPage from "../pages/DiplomaStreamPage";
import VocationalStreamPage from "../pages/VocationalStreamPage";
import GovernmentStreamPage from "../pages/GovernmentStreamPage";
import NotFoundPage from "../pages/NotFoundPage";
import AdminDashboardPage from "../admin/AdminDashboardPage";
import AdminLoginPage from "../admin/AdminLoginPage";
import AdminRegisterPage from "../admin/AdminRegisterPage";
import StreamsAdminPage from "../admin/StreamsPage";
import DepartmentsAdminPage from "../admin/DepartmentsPage";
import JobsAdminPage from "../admin/JobsPage";
import QuizAdminPage from "../admin/QuizPage";
import CollegeDetailsPage from "../pages/CollegeDetailsPage";
import ContactPage from "../pages/ContactPage";
import ServicesPage from "../pages/ServicesPage";
import RoadmapPage from "../pages/RoadmapPage";
import ResumeBuilderPage from "../pages/ResumeBuilderPage";
import CoverLetterPage from "../pages/CoverLetterPage";
import ChatbotPage from "../pages/ChatbotPage";
import MentorsPage from "../pages/MentorsPage";

export const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="streams" element={<StreamsPage />} />
        <Route path="stream/engineering" element={<EngineeringStreamPage />} />
        <Route path="stream/engineering/category/:categorySlug" element={<EngineeringStreamPage />} />
        <Route path="stream/arts-science" element={<ArtsScienceStreamPage />} />
        <Route path="stream/arts-science/category/:categorySlug" element={<ArtsScienceStreamPage />} />
        <Route path="stream/commerce" element={<CommerceStreamPage />} />
        <Route path="stream/commerce/category/:categorySlug" element={<CommerceStreamPage />} />
        <Route path="stream/medical" element={<MedicalStreamPage />} />
        <Route path="stream/medical/category/:categorySlug" element={<MedicalStreamPage />} />
        <Route path="stream/paramedical" element={<ParamedicalStreamPage />} />
        <Route path="stream/paramedical/category/:categorySlug" element={<ParamedicalStreamPage />} />
        <Route path="stream/agriculture" element={<AgricultureStreamPage />} />
        <Route path="stream/agriculture/category/:categorySlug" element={<AgricultureStreamPage />} />
        <Route path="stream/law" element={<LawStreamPage />} />
        <Route path="stream/law/category/:categorySlug" element={<LawStreamPage />} />
        <Route path="stream/design-media" element={<DesignMediaStreamPage />} />
        <Route path="stream/design-media/category/:categorySlug" element={<DesignMediaStreamPage />} />
        <Route path="stream/management" element={<ManagementStreamPage />} />
        <Route path="stream/management/category/:categorySlug" element={<ManagementStreamPage />} />
        <Route path="stream/diploma-polytechnic" element={<DiplomaStreamPage />} />
        <Route path="stream/diploma-polytechnic/category/:categorySlug" element={<DiplomaStreamPage />} />
        <Route path="stream/vocational-skill-based" element={<VocationalStreamPage />} />
        <Route path="stream/vocational-skill-based/category/:categorySlug" element={<VocationalStreamPage />} />
        <Route path="stream/government-career-paths" element={<GovernmentStreamPage />} />
        <Route path="stream/government-career-paths/category/:categorySlug" element={<GovernmentStreamPage />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="colleges" element={<DepartmentsPage />} />
        <Route path="explore-3d" element={<Explore3DPage />} />
        <Route path="departments/:id" element={<DepartmentDetailsPage />} />
        <Route path="department/:slug" element={<DepartmentDetailsPage />} />
        <Route path="colleges/:slug" element={<CollegeDetailsPage />} />
        <Route path="future-jobs" element={<FutureJobsPage />} />
        <Route path="compare-courses" element={<CompareCoursesPage />} />
        <Route path="career-quiz" element={<QuizPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="quiz/result" element={<QuizResultPage />} />
        <Route path="career-quiz/result" element={<QuizResultPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="parent" element={<ParentModePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="resume-builder" element={<ResumeBuilderPage />} />
        <Route path="cover-letter" element={<CoverLetterPage />} />
        <Route path="career-ai" element={<ChatbotPage />} />
        <Route path="mentors" element={<MentorsPage />} />
        <Route path="career-roadmap" element={<RoadmapPage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/register" element={<AdminRegisterPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="streams" element={<StreamsAdminPage />} />
        <Route path="departments" element={<DepartmentsAdminPage />} />
        <Route path="jobs" element={<JobsAdminPage />} />
        <Route path="quiz" element={<QuizAdminPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </>,
  ),
);
