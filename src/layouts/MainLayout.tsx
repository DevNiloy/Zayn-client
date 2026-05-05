import AppWrapper from "@/components/shared/AppWraper";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div>
      <Navbar />
      <div className="mt-10">
        <ScrollToTop />
        <AppWrapper>
          <Outlet />
          <Footer />
        </AppWrapper>
      </div>
    </div>
  );
}

export default MainLayout;
