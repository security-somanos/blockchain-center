import Image from "next/image";
import Globe from "../components/Globe";

export default function Home() {
  return (
    <section className="relative flex w-full h-[calc(100vh-100px)] items-center justify-center overflow-hidden font-sans">
      {/* Mobile background globe */}
      <div className="pointer-events-none absolute inset-0 z-0 md:hidden">
        <Globe
          autoRotateSpeed={0.03}
          pointSize={0.012}
          tileDeg={1}
          zoom={false}
          showLabels={false}
          backOpacity={0.04}
          fillOpacity={0.5}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 py-0 sm:px-12 md:grid-cols-2">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <h1 className="mt-8 max-w-xl text-2xl font-semibold md:leading-12 tracking-tight text-white md:text-5xl">
            Explore the Blockchain Center Worldwide
          </h1>
          <p className="mt-4 max-w-lg text-sm text-gray-300 leading-5">
            Interactive globe with pins and labels. Drag to rotate.<br /> Click a pin to reveal details.
          </p>
          <div className="mt-8 flex gap-4 text-sm">
            <a
              className="flex h-10 items-center justify-center gap-2 rounded-full bg-white px-5 text-black transition-colors hover:bg-gray-200"
              href="#"
            >
              Get Started
            </a>
            <a
              className="flex h-10 items-center justify-center rounded-full border border-solid border-gray-600 px-5 transition-colors hover:border-gray-400 hover:bg-gray-800"
              href="#"
            >
              Learn More
            </a>
          </div>
        </div>

        <div className="relative hidden w-full md:block md:h-[700px]">
          <div className="absolute inset-0">
            <Globe
              autoRotateSpeed={0.03}
              pointSize={0.012}
              tileDeg={1}
              zoom={false}
              showLabels={false}
              backOpacity={0.05}
              fillOpacity={0.6}
            />
          </div>
        </div>
      </div>

    </section>
  );
}
