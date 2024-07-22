// SPDX-FileCopyrightText: 2024 PNED G.I.E.
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

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

const getThemesFromEnv = () => {
  const themesEnv = process.env.NEXT_PUBLIC_THEMES_LIST;
  if (!themesEnv) {
    return allThemes;
  }

  try {
    const themesList = JSON.parse(themesEnv);
    return allThemes.filter((theme) => themesList.includes(theme.name));
  } catch (error) {
    console.error("Error parsing NEXT_PUBLIC_THEMES_LIST:", error);
    return allThemes;
  }
};

const ThemesSection = ({ maxThemes }: { maxThemes?: number }) => {
  const themes = getThemesFromEnv();
  const displayedThemes = maxThemes ? themes.slice(0, maxThemes) : themes;

  return (
    <section className="mb-20">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {displayedThemes.map((theme) => (
          <a
            key={theme.name}
            className="bg-white py-6 flex items-center justify-center px-2 rounded-lg h-[166px] shadow-lg border-b-4 border-b-[#B5BFC4] hover:border-b-secondary transition hover:bg-gray-50"
            href={`/datasets?page=1&ckan-theme=${(theme.desc || theme.name)
              .toLowerCase()
              .replace(/[\s,]+/g, "-")}`}
          >
            <div className="flex flex-col justify-center items-center text-center">
              <img
                alt={`${theme.name}-collection`}
                src={theme.img.src}
                width="48"
                height="48"
              />
              <h3 className="font-semibold text-lg sm:mt-1">{theme.name}</h3>
              <div className="leading-4 max-w-[8.5rem]">{theme.desc}</div>
            </div>
          </a>
        ))}
      </div>
      <div className="pt-4 px-8 sm:px-0 w-full flex">
        <a
          className="text-primary flex items-center gap-1 transition hover:underline duration-500 ml-auto"
          href="/themes"
        >
          See all
          <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};

export default ThemesSection;
