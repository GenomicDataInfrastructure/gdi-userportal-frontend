// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "next/navigation";

// Import all theme images
import agricultureImg from "../public/themes/agriculture.svg";
import economyImg from "../public/themes/economy.svg";
import educationImg from "../public/themes/education.svg";
import energyImg from "../public/themes/energy.svg";
import envImg from "../public/themes/env.svg";
import governmentImg from "../public/themes/government.svg";
import healthImg from "../public/themes/health.svg";
import internationalIssuesImg from "../public/themes/international_issues.svg";
import justiceImg from "../public/themes/justice.svg";
import populationImg from "../public/themes/population.svg";
import regionsImg from "../public/themes/regions.svg";
import techImg from "../public/themes/tech.svg";
import transportImg from "../public/themes/transport.svg";

const allThemes = [
  {
    name: "Agriculture",
    img: agricultureImg,
    desc: "Agriculture, fisheries, forestry and food",
  },
  { name: "Economy", img: economyImg, desc: "Economy and finance" },
  {
    name: "Education",
    img: educationImg,
    desc: "Education, culture and sport",
  },
  { name: "Energy", img: energyImg },
  { name: "Environment", img: envImg },
  {
    name: "Government",
    img: governmentImg,
    desc: "Government and public sector",
  },
  { name: "Health", img: healthImg },
  {
    name: "International Issues",
    img: internationalIssuesImg,
  },
  {
    name: "Justice",
    img: justiceImg,
    desc: "Justice, legal system and public safety",
  },
  { name: "Population", img: populationImg, desc: "Population and society" },
  { name: "Regions", img: regionsImg, desc: "Regions and cities" },
  { name: "Tech", img: techImg, desc: "Science and technology" },
  { name: "Transport", img: transportImg },
];

const ThemesSection = ({ maxThemes }: { maxThemes?: number }) => {
  const themes = allThemes.slice(0, maxThemes);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const queryParams = useSearchParams();

  const updateMaxScroll = () => {
    if (containerRef.current) {
      setMaxScroll(
        containerRef.current.scrollWidth - containerRef.current.clientWidth
      );
    }
  };

  useEffect(() => {
    updateMaxScroll();
    window.addEventListener("resize", updateMaxScroll);
    return () => {
      window.removeEventListener("resize", updateMaxScroll);
    };
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = 202;

    if (direction === "left") {
      container.scrollTo({
        left: scrollPosition - scrollAmount,
        behavior: "smooth",
      });
      setScrollPosition((prev) => Math.max(prev - scrollAmount, 0));
    } else {
      container.scrollTo({
        left: scrollPosition + scrollAmount,
        behavior: "smooth",
      });
      setScrollPosition((prev) => Math.min(prev + scrollAmount, maxScroll));
    }
  };

  return (
    <section className="mx-12 my-4 flex flex-col items-center relative">
      <button
        className="absolute left-[-40px] z-10 p-2 bg-white border rounded-full shadow-md hover:border-b-secondary transition hover:bg-gray-50"
        onClick={() => handleScroll("left")}
        style={{ top: "50%", transform: "translateY(-50%)" }}
        disabled={scrollPosition === 0}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <div
        className="flex space-x-4 px-4 overflow-x-hidden"
        ref={containerRef}
        style={{ scrollBehavior: "smooth", maxWidth: "100%" }}
      >
        {themes.map((theme) => (
          <a
            key={theme.name}
            className="flex-none bg-white py-6 flex items-center justify-center px-2 rounded-lg w-[184px] h-[166px] shadow-lg border-b-4 border-b-[#B5BFC4] hover:border-b-secondary transition hover:bg-gray-50"
            href={`/datasets?page=1&ckan-theme=${(theme.desc || theme.name).toLowerCase().replace(/[\s,]+/g, "-")}`}
          >
            <div className="flex flex-col justify-center items-center text-center">
              <img
                alt={`${theme.name}-collection`}
                src={theme.img.src}
                width="48"
                height="48"
              />
              <h3 className="font-semibold text-lg sm:mt-1">{theme.name}</h3>
              {theme.desc && (
                <div className="leading-4 max-w-[8.5rem]">{theme.desc}</div>
              )}
            </div>
          </a>
        ))}
      </div>
      <button
        className="absolute right-[-50px] z-10 p-2 bg-white border rounded-full shadow-md hover:border-b-secondary transition hover:bg-gray-50"
        onClick={() => handleScroll("right")}
        style={{ top: "50%", transform: "translateY(-50%)" }}
        disabled={scrollPosition >= maxScroll}
      >
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </section>
  );
};

export default ThemesSection;
