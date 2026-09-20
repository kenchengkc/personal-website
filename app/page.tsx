import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Columbia } from "@/components/sections/Columbia";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { BlogList } from "@/components/sections/BlogList";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <main className="site-main">
        <Hero />
        <About />
        <Columbia />
        <Skills />
        <Projects />
        <BlogList />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
