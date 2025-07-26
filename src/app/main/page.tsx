import { Separator } from "@/ui/Separator";
import HeroSection from "@/section/HeroSection";
import PricingSection from "@/section/PricingSection";
import HowItWorksSection from "@/section/HowItWorksSection";
import ChooseLanguageSection from "@/section/ChooseLanguageSection";

export default function MainPage() {
  return (
    <div className="container mx-auto gap-4 px-12">
      <HeroSection />
      <Separator orientation="horizontal" />
      <ChooseLanguageSection />
      <Separator orientation="horizontal" />
      <HowItWorksSection />
      <Separator orientation="horizontal" />
      <PricingSection />
    </div>
  );
}
