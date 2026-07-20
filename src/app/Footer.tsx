// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import ContactUsModal from "@/components/ContactUsModal";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { Link } from "@/i18n/navigation";
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
import { useTranslations } from "next-intl";
import contentConfig from "@/config/contentConfig";

function Footer() {
  const t = useTranslations();

  return (
    <>
      <div className="bg-primary p-4 text-center mt-4">
        <a
          href={contentConfig.bannerLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-warning" />
          <h2 className="inline text-lg text-white">{t("footer.banner")}</h2>
          <FontAwesomeIcon icon={faArrowRight} className="ml-2 text-white" />
        </a>
      </div>
      <footer className="flex flex-col items-center bg-footer justify-center gap-y-4 border-t-primary p-7 md:flex-row md:gap-x-12 md:gap-y-0">
        <div className="container mx-auto flex flex-col gap-16 md:flex-row md:gap-24">
          {/* First column: About the project */}
          <div className="flex flex-col items-start gap-4 w-full md:w-3/5">
            <div className="flex items-center gap-4">
              {contentConfig.websiteUrl ? (
                <a
                  href={contentConfig.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={"/footer-logo.png"}
                    alt="Footer logo"
                    width={150}
                    height={100}
                  />
                </a>
              ) : (
                <Image
                  src={"/footer-logo.png"}
                  alt="Footer logo"
                  width={150}
                  height={100}
                />
              )}
              {contentConfig.footerLogos &&
                contentConfig.footerLogos.length > 0 && (
                  <div className="flex gap-4 items-center">
                    {contentConfig.footerLogos.map((logo) => {
                      const image = (
                        <Image
                          src={logo.src}
                          alt={logo.alt}
                          className="object-contain"
                        />
                      );

                      return (
                        <div key={logo.alt} className="flex items-center">
                          {logo.url ? (
                            <a
                              href={logo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {image}
                            </a>
                          ) : (
                            image
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              <Image
                src={"/secondary-logo-v1.png"}
                alt="1+MG Initiative logo - European genomic data sharing initiative"
                width={100}
                height={70}
                className="object-contain"
              />
              <Image
                src={"/b1mg-logo.png"}
                alt="B1MG project logo - Beyond 1 Million Genomes"
                width={100}
                height={70}
                className="object-contain"
              />
            </div>
            <p className="text-xs md:text-sm">
              {t("footer.funding")
                .split("\n")
                .map((line, index, lines) => (
                  <span key={index}>
                    {line}
                    {index < lines.length - 1 && <br />}
                  </span>
                ))}
            </p>
          </div>
          {/* Second column: Legal */}
          <div className="flex flex-col gap-2 text-left w-full md:w-1/6">
            <h3 className="text-lg font-bold">{t("footer.legal")}</h3>
            <Link href="/legal#website-terms" className="hover:text-info">
              {t("footer.terms")}
            </Link>
            <Link href="/legal#privacy-notice" className="hover:text-info">
              {t("footer.privacy")}
            </Link>
            <Link href="/legal#cookies" className="hover:text-info">
              {t("footer.cookies")}
            </Link>
          </div>
          {/* Third column: Portal links */}
          <div className="flex flex-col gap-2 text-left w-full md:w-1/6">
            <h3 className="text-lg font-bold">{t("footer.portalLinks")}</h3>
            <Link className="hover:text-info" href="/datasets">
              {t("nav.datasets")}
            </Link>
            <Link className="hover:text-info" href="/themes">
              {t("nav.themes")}
            </Link>
            <Link className="hover:text-info" href="/publishers">
              {t("nav.publishers")}
            </Link>
            <Link className="hover:text-info" href="/about">
              {t("nav.about")}
            </Link>
          </div>
          {/* Fourth column: Contact us */}
          <div className="flex flex-col gap-2 text-left w-full md:w-1/3">
            <h3 className="text-lg font-bold">{t("footer.contactUs")}</h3>
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
            {contentConfig.multilingualEnabled && (
              <div className="mt-2 max-w-[180px]">
                <LocaleSwitcher />
              </div>
            )}
            {contentConfig.contactUsEnabled && <ContactUsModal />}
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
