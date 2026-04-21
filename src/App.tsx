import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import TutorListPage from "./pages/TutorListPage";
import TutorDetailPage from "./pages/TutorDetailPage";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tutors" element={<TutorListPage />} />
            <Route path="/tutors/:id" element={<TutorDetailPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
