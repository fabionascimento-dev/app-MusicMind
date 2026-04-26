import { useCallback, useState } from "react";
import { useTracksResource } from "./hooks/useTracksResource";
import { useLearningPathResource } from "./hooks/useLearningPathResource";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { EducationSection } from "./components/EducationSection";
import { Footer } from "./components/Footer";
import { PlayerSection, type NowPlaying } from "./components/PlayerSection";
import { RecommendationsSection } from "./components/RecommendationsSection";
import type { TrackDto } from "./types/api";

const demoPlaying: NowPlaying = {
  id: "default",
  title: "Música demonstrativa",
  subtitle: "Conteúdo vindo da API (seleccione um cartão embaixo).",
  imageUrl: "https://picsum.photos/seed/hero-player/300/300",
};

function toNow(t: TrackDto): NowPlaying {
  return { id: t.id, title: t.title, subtitle: t.description, imageUrl: t.imageUrl };
}

/**
 * Aplicação de página única: liga a UI aos hooks de dados e passa o estado de seleção ao player.
 */
export default function App() {
  const { status: tStatus, data: tracks, message: tError } = useTracksResource();
  const { status: pStatus, data: path, message: pError } = useLearningPathResource();
  const [selected, setSelected] = useState<TrackDto | null>(null);
  const current = selected ? toNow(selected) : demoPlaying;
  const loadingT = tStatus === "loading" || tStatus === "idle";
  const loadingP = pStatus === "loading" || pStatus === "idle";
  const list = tracks ?? [];

  const onSelect = useCallback((t: TrackDto) => {
    setSelected(t);
    document.getElementById("player")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PlayerSection key={current.id} current={current} />
        <RecommendationsSection
          tracks={list}
          isLoading={loadingT}
          error={tError}
          onSelect={onSelect}
          selectedId={selected?.id ?? null}
        />
        <EducationSection steps={path} isLoading={loadingP} error={pError} />
      </main>
      <Footer />
    </>
  );
}
