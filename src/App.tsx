import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import CatalogPage from "@/pages/CatalogPage";
import ProductPage from "@/pages/ProductPage";
import FestasPage from "@/pages/FestasPage";
import DatasComemorativasPage from "@/pages/DatasComemorativasPage";
import KitDigitalPage from "@/pages/KitDigitalPage";
import DownloadsPage from "@/pages/DownloadsPage";
import ComoBaixarPage from "@/pages/ComoBaixarPage";
import ContatoPage from "@/pages/ContatoPage";
import EntrarPage from "@/pages/EntrarPage";
import RedefinirSenhaPage from "@/pages/RedefinirSenhaPage";
import ContaPage from "@/pages/ContaPage";
import PedidoStatusPage from "@/pages/PedidoStatusPage";
import AdminPage from "@/pages/AdminPage";
import OnboardingPage from "@/pages/OnboardingPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/produto/:id" element={<ProductPage />} />
          <Route path="/festas" element={<FestasPage />} />
          <Route path="/datas-comemorativas" element={<DatasComemorativasPage />} />
          <Route path="/kit-digital" element={<KitDigitalPage />} />
          <Route path="/downloads" element={<DownloadsPage />} />
          <Route path="/como-baixar" element={<ComoBaixarPage />} />
          <Route path="/contato" element={<ContatoPage />} />
          <Route path="/entrar" element={<EntrarPage />} />
          <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />
          <Route path="/conta" element={<ContaPage />} />
          <Route path="/pedido/:status" element={<PedidoStatusPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/bem-vindo" element={<OnboardingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
