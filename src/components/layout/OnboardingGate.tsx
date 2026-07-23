import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { usePerfil } from "@/store/perfil";

// Rotas que nunca interrompemos: o próprio onboarding, o fluxo de login e o
// retorno do pagamento (não faz sentido cortar a confirmação da compra).
const ISENTAS = ["/bem-vindo", "/entrar", "/redefinir-senha", "/pedido"];

// Manda quem acabou de entrar pela primeira vez (perfil sem `onboarding_em`)
// para a tela de boas-vindas, preservando o destino original.
export default function OnboardingGate() {
  const user = useAuth((s) => s.user);
  const carregandoAuth = useAuth((s) => s.carregando);
  const perfil = usePerfil((s) => s.perfil);
  const carregandoPerfil = usePerfil((s) => s.carregando);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (carregandoAuth || carregandoPerfil) return;
    if (!user || !perfil) return;
    if (perfil.onboarding_em) return;
    if (ISENTAS.some((p) => location.pathname.startsWith(p))) return;

    const destino = encodeURIComponent(location.pathname + location.search);
    navigate(`/bem-vindo?redirect=${destino}`, { replace: true });
  }, [user, perfil, carregandoAuth, carregandoPerfil, location, navigate]);

  return null;
}
