import HeroSection from "@/app/homecomponent/hero/hero";
import Navbar from "@/app/homecomponent/navbar/navbar";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/home/image (20).jpeg')" , backgroundSize: "cover", backgroundRepeat: "no-repeat", }}>
      <Navbar />
      <HeroSection />
    </main>
  );
}
