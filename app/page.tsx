import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Highlights } from "@/components/sections/Highlights";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
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
        <Highlights />
        <About />
        <Experience />
        <Projects />
        <BlogList />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
