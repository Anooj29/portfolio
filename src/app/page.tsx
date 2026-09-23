import { site } from "@/content/site";
import { hasResume } from "@/lib/resume";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Achievements from "@/components/sections/Achievements";
import Contact from "@/components/sections/Contact";

export default function Home() {
  const resume = hasResume();
  return (
    <>
      <Hero resume={resume} />
      <About />
      <Projects />
      <Skills />
      <Experience resume={resume} resumePath={site.resumePath} />
      <Achievements />
      <Contact resume={resume} />
    </>
  );
}
