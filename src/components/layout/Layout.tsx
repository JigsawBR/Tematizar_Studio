import { Outlet, useLocation } from "react-router-dom";
import PromoBar from "@/components/layout/PromoBar";
import Header from "@/components/layout/Header";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import CartDrawer from "@/components/cart/CartDrawer";
import Toast from "@/components/ui/Toast";

export default function Layout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <PromoBar />
      <div className="sticky top-0 z-40 shadow-[0_4px_20px_rgba(138,102,174,.10)]">
        <Header />
        <Nav />
      </div>
      <main className="flex-1">
        {/* Fade suave a cada mudança de rota (remonta pela key). */}
        <div key={location.pathname} className="animate-fade-in">
          <Outlet />
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
    </div>
  );
}
