import { Suspense } from "react";
import Navbar from "../components/Navbar";
import CartButton from "../components/CartButton";
import Recommendations from "../components/Recommendations";
import LoadingProvider from "../components/LoadingProvider";
import HeroSection from "../components/HeroSection";
import BrandsShowcase from "../components/BrandsShowcase";
import CategoryCards from "../components/CategoryCards";
import PromoBanner from "../components/PromoBanner";
import BenefitsSection from "../components/BenefitsSection";
import Footer from "../components/footer";
import RecommendationsSkeleton from "../components/RecommendationsSkeleton";

export default function Home() {
  return (
    <LoadingProvider>
      <main>
        <Navbar />
        <HeroSection />
        <BrandsShowcase />
        <CategoryCards />
        <PromoBanner />
        <BenefitsSection />
        <Suspense fallback={<RecommendationsSkeleton />}>
          <Recommendations limit={6} productBasePath="/products" />
        </Suspense>
        <Footer />
        <CartButton />
      </main>
    </LoadingProvider>
  );
}