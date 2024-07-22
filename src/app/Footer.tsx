// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import {
  faGithub,
  faLinkedin,
  faXTwitter,
  faGitlab,
} from "@fortawesome/free-brands-svg-icons";
import {
  faGlobe,
  faInfoCircle,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import footerLogo from "../public/footer-logo.png";
import serverConfig from "@/config/serverConfig";

function Footer() {
  return (
    <>
      <div className="bg-primary p-4 text-center mt-4">
        <a
          href={serverConfig.bannerLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-warning" />
          <h2 className="inline text-lg font-bold text-warning">
            How to use the data portal
          </h2>
          <FontAwesomeIcon icon={faArrowRight} className="ml-2 text-warning" />
        </a>
      </div>
      <footer className="flex flex-col items-center bg-surface justify-center gap-y-4 border-t-primary p-7 md:flex-row md:gap-x-12 md:gap-y-0">
        <div className="container mx-auto flex flex-col gap-16 md:flex-row md:gap-24">
          {/* First column: About the project */}
          <div className="flex flex-col items-start gap-4">
            <Image src={footerLogo} alt="Footer logo" width={80} />
            <p className="text-xs md:text-sm">
              {serverConfig.footerText.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  {index < serverConfig.footerText.split("\n").length - 1 && (
                    <br />
                  )}
                </span>
              ))}
            </p>
          </div>
          {/* Second column: Fixed links */}
          <div className="flex flex-col gap-2 text-left">
            <h3 className="text-lg font-bold">Legal</h3>
            <a className="hover:text-info">Terms & Conditions</a>
            <a className="hover:text-info">Privacy Notice</a>
            <a className="hover:text-info">Cookie Policy</a>
          </div>
          {/* Third column: Portal links */}
          <div className="flex flex-col gap-2 text-left">
            <h3 className="text-lg font-bold">Portal Links</h3>
            <a className="hover:text-info">Datasets</a>
            <a className="hover:text-info">Themes</a>
            <a className="hover:text-info">Organizations</a>
          </div>
          {/* Fourth column: Contact us */}
          <div className="flex flex-col gap-2 text-left">
            <h3 className="text-lg font-bold">Contact Us</h3>
            <div className="flex gap-4">
              {serverConfig.linkedInUrl && (
                <a
                  href={serverConfig.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-info"
                >
                  <FontAwesomeIcon
                    icon={faLinkedin}
                    className="text-lg md:text-2xl"
                  />
                </a>
              )}
              {serverConfig.twitterUrl && (
                <a
                  color="primary"
                  href={serverConfig.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-info"
                >
                  <FontAwesomeIcon
                    icon={faXTwitter}
                    className="text-lg md:text-2xl"
                  />
                </a>
              )}
              {serverConfig.githubUrl && (
                <a
                  color="primary"
                  href={serverConfig.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-info"
                >
                  <FontAwesomeIcon
                    icon={faGithub}
                    className="text-lg md:text-2xl"
                  />
                </a>
              )}
              {serverConfig.gitlabUrl && (
                <a
                  color="primary"
                  href={serverConfig.gitlabUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-info"
                >
                  <FontAwesomeIcon
                    icon={faGitlab}
                    className="text-lg md:text-2xl"
                  />
                </a>
              )}
              {serverConfig.websiteUrl && (
                <a
                  color="primary"
                  href={serverConfig.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-info"
                >
                  <FontAwesomeIcon
                    icon={faGlobe}
                    className="text-lg md:text-2xl"
                  />
                </a>
              )}
            </div>
            {serverConfig.email && (
              <a
                className="text-xs hover:text-info md:text-left md:text-sm"
                href={`mailto:${encodeURIComponent(serverConfig.email)}`}
              >
                {serverConfig.email}
              </a>
            )}
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
