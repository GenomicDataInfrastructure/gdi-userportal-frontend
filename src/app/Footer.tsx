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
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
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

  return (
    <footer className="mt-8 flex flex-col items-center justify-between gap-y-4 border-t-4 border-t-primary bg-surface p-7 md:flex-row md:gap-x-4 md:gap-y-0">
      <div className="flex items-center gap-4">
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

      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-center gap-11 text-primary">
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
              <FontAwesomeIcon icon={faGlobe} className="text-lg md:text-2xl" />
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
    </footer>
  );
}

export default Footer;
