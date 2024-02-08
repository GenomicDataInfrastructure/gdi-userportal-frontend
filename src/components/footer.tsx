// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
"use client";
import {
  faGithub,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Image from "next/image";
import flag from "../public/eu-flag.png";

function Footer() {
  return (
    <footer className="bg-white-smoke flex flex-col md:flex-row justify-between p-7 gap-y-4 items-center md:gap-y-0 md:gap-x-4 border-t-[#7B1C58] border-t-4">
      <div className="flex items-center gap-4">
        <Image src={flag} alt="EU flag" width={80} />
        <p className="text-[10px] md:text-[12px]">
          GDI project receives funding from the European Union’s Digital Europe
          <br />
          Programme under grant agreement number 101081813.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-11 text-secondary justify-center">
          <a
            href="https://www.linkedin.com/company/gdi-euproject/"
            target="_blank"
            rel="noopener"
            className="hover:text-info"
          >
            <FontAwesomeIcon
              icon={faLinkedin}
              className="text-lg md:text-2xl"
            />
          </a>
          <a
            color="primary"
            href="https://twitter.com/GDI_EUproject"
            target="_blank"
            rel="noopener"
            className="hover:text-info"
          >
            <FontAwesomeIcon
              icon={faXTwitter}
              className="text-lg md:text-2xl"
            />
          </a>
          <a
            mat-icon-button
            color="primary"
            href="https://github.com/GenomicDataInfrastructure"
            target="_blank"
            rel="noopener"
            className="hover:text-info"
          >
            <FontAwesomeIcon icon={faGithub} className="text-lg md:text-2xl" />
          </a>
          <a
            mat-icon-button
            color="primary"
            href="https://gdi.onemilliongenomes.eu/"
            target="_blank"
            rel="noopener"
            className="hover:text-info"
          >
            <FontAwesomeIcon icon={faGlobe} className="text-lg md:text-2xl" />
          </a>
        </div>
        <a
          className="text-xs md:text-sm  text-[#2d2f46] md:text-left hover:text-info"
          href="mailto:gdi-coordination@elixir-europe.org"
        >
          gdi-coordination&#64;elixir-europe.org
        </a>
      </div>
    </footer>
  );
}

export default Footer;
