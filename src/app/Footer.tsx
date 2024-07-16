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

function Footer() {
  const linkedInUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL;
  const twitterUrl = process.env.NEXT_PUBLIC_TWITTER_URL;
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL;
  const gitlabUrl = process.env.NEXT_PUBLIC_GITLAB_URL;
  const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
  const email = process.env.NEXT_PUBLIC_EMAIL;
  const footerText =
    process.env.NEXT_PUBLIC_FOOTER_TEXT ||
    "GDI project receives funding from the European Union’s Digital Europe Programme under grant agreement number 101081813.";
  const bannerLink = process.env.NEXT_PUBLIC_BANNER_LINK || "";

  return (
    <>
      <div className="bg-primary p-4 text-center">
        <a
          href={bannerLink ? `https://${bannerLink}` : "#"}
          target={bannerLink ? "_blank" : ""}
          rel={bannerLink ? "noopener noreferrer" : ""}
        >
          <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-warning" />
          <h2 className="inline text-lg font-bold text-warning">
            How to use the data portal
          </h2>
          <FontAwesomeIcon icon={faArrowRight} className="ml-2 text-warning" />
        </a>
      </div>
      <footer className="flex flex-col items-center justify-between gap-y-4 border-t-primary bg-surface p-7 md:flex-row md:gap-x-12 md:gap-y-0 md:items-start">
        <div className="flex flex-col gap-16 md:flex-row md:gap-24">
          {/* First column: About the project */}
          <div className="flex flex-col items-start gap-4">
            <Image src={footerLogo} alt="Footer logo" width={80} />
            <p className="text-xs md:text-sm">
              {footerText.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  {index < footerText.split("\n").length - 1 && <br />}
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
              {linkedInUrl && (
                <a
                  href={linkedInUrl}
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
              {twitterUrl && (
                <a
                  color="primary"
                  href={twitterUrl}
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
              {githubUrl && (
                <a
                  color="primary"
                  href={githubUrl}
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
              {gitlabUrl && (
                <a
                  color="primary"
                  href={gitlabUrl}
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
              {websiteUrl && (
                <a
                  color="primary"
                  href={websiteUrl}
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
            {email && (
              <a
                className="text-xs hover:text-info md:text-left md:text-sm"
                href={`mailto:${encodeURIComponent(email)}`}
              >
                {email}
              </a>
            )}
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
