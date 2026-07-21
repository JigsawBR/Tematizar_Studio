import { Outlet } from "react-router-dom";
import PromoBar from "@/components/layout/PromoBar";
import Header from "@/components/layout/Header";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import CartDrawer from "@/components/cart/CartDrawer";
import Toast from "@/components/ui/Toast";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <PromoBar />
      <Header />
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
    </div>
  );
}
