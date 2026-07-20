import PromoBar from "./components/PromoBar";
import Header from "./components/Header";
import Nav from "./components/Nav";
import PageHeader from "./components/PageHeader";
import Filters from "./components/Filters";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";

export default function App() {
  return (
    <>
      <PromoBar />
      <Header />
      <Nav />
      <PageHeader />

      <div className="mx-auto grid max-w-conteudo grid-cols-1 items-start gap-6 px-5 py-5 md:grid-cols-[260px_1fr]">
        <Filters />
        <ProductGrid />
      </div>

      <Footer />
      <CartDrawer />
      <Toast />
    </>
  );
}
