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
import contentConfig from "@/config/contentConfig";
import Link from "next/link";

function Footer() {
  return (
    <>
      <div className="bg-primary p-4 text-center mt-4">
        <a
          href={contentConfig.bannerLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-warning" />
          <h2 className="inline text-lg text-white">
            How to use the data portal
          </h2>
          <FontAwesomeIcon icon={faArrowRight} className="ml-2 text-white" />
        </a>
      </div>
      <footer className="flex flex-col items-center bg-gray-50 justify-center gap-y-4 border-t-primary p-7 md:flex-row md:gap-x-12 md:gap-y-0">
        <div className="container mx-auto flex flex-col gap-16 md:flex-row md:gap-24">
          {/* First column: About the project */}
          <div className="flex flex-col items-start gap-4 w-full md:w-3/5">
            <Image
              src={"/footer-logo.png"}
              alt="Footer logo"
              width={150}
              height={100}
            />
            <p className="text-xs md:text-sm">
              {contentConfig.footerText.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  {index < contentConfig.footerText.split("\n").length - 1 && (
                    <br />
                  )}
                </span>
              ))}
            </p>
          </div>
          {/* Second column: Legal */}
          <div className="flex flex-col gap-2 text-left w-full md:w-1/6">
            <h3 className="text-lg">Legal</h3>
            <a href="/legal#website-terms" className="hover:text-info">
              Terms & Conditions
            </a>
            <a href="/legal#privacy-notice" className="hover:text-info">
              Privacy Notice
            </a>
            <a href="/legal#cookies" className="hover:text-info">
              Cookie Policy
            </a>
          </div>
          {/* Third column: Portal links */}
          <div className="flex flex-col gap-2 text-left w-full md:w-1/6">
            <h3 className="text-lg">Portal Links</h3>
            <Link className="hover:text-info" href="/datasets">
              Datasets
            </Link>
            <Link className="hover:text-info" href="/themes">
              Themes
            </Link>
            <Link className="hover:text-info" href="/publishers">
              Publishers
            </Link>
            <Link className="hover:text-info" href="/about">
              About
            </Link>
          </div>
          {/* Fourth column: Contact us */}
          <div className="flex flex-col gap-2 text-left w-full md:w-1/3">
            <h3 className="text-lg">Contact Us</h3>
            <div className="flex gap-4">
              {contentConfig.linkedInUrl && (
                <a
                  href={contentConfig.linkedInUrl}
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
              {contentConfig.twitterUrl && (
                <a
                  color="primary"
                  href={contentConfig.twitterUrl}
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
              {contentConfig.githubUrl && (
                <a
                  color="primary"
                  href={contentConfig.githubUrl}
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
              {contentConfig.gitlabUrl && (
                <a
                  color="primary"
                  href={contentConfig.gitlabUrl}
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
              {contentConfig.websiteUrl && (
                <a
                  color="primary"
                  href={contentConfig.websiteUrl}
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
            {contentConfig.email && (
              <a
                className="text-xs hover:text-info md:text-left md:text-sm"
                href={`mailto:${encodeURIComponent(contentConfig.email)}`}
              >
                {contentConfig.email}
              </a>
            )}
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
