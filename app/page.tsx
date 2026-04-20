import { Navbar } from "@/components/Navbar";
import { SECTION_REGISTRY } from "@/components/sections/registry";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-slate-900 text-slate-50">
      <Navbar
        sections={SECTION_REGISTRY.map(({ id, label }) => ({ id, label }))}
      />

      <div className="flex flex-col">
        {SECTION_REGISTRY.map(({ id, bgClass, fullBleed, Component }) => (
          <section
            key={id}
            id={id}
            data-bg={bgClass?.replace("bg-", "")}
            className={`min-h-screen ${fullBleed ? "flex" : "flex items-center justify-center px-6 py-24"} ${bgClass ?? ""}`}
          >
            <Component />
          </section>
        ))}
      </div>
    </main>
  );
}