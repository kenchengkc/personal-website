import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { BlogList } from "@/components/sections/BlogList";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="v2-main">
        <Hero />
        <About />
        <Projects />
        <BlogList />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
