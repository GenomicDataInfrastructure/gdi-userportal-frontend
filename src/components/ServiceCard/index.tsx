// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faDatabase,
  faLineChart,
} from "@fortawesome/free-solid-svg-icons";

export type ServiceKey = "datasetDiscovery" | "alleleFrequency";

export type Service = {
  key: ServiceKey;
  name: string;
  shortName: string;
  usageCost: string;
  overview: string;
  intendedUsers: string;
  keyFeatures: string[];
};

type ServiceCardProps = {
  service: Service;
};

function getServiceIcon(key: ServiceKey) {
  if (key === "datasetDiscovery") {
    return faDatabase;
  }
  if (key === "alleleFrequency") {
    return faLineChart;
  }
  return undefined;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-gray-100 pt-4">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-info">
        {title}
      </h3>
      {children}
    </div>
  );
}

function FeatureItem({ item }: { item: string }) {
  const match = item.match(/\*\*(.+?)\*\*(.*)/);
  if (!match) {
    return <li className="text-sm text-gray-700">{item}</li>;
  }

  const [, bold, rest] = match;
  return (
    <li className="text-sm text-gray-700">
      <span className="font-semibold text-gray-900">{bold}</span>
      {rest}
    </li>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item, index) => (
        <FeatureItem key={index} item={item} />
      ))}
    </ul>
  );
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const t = useTranslations();
  const [isExpanded, setIsExpanded] = useState(false);
  const icon = getServiceIcon(service.key);

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-start gap-4 p-6 text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
        aria-expanded={isExpanded}
      >
        {icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FontAwesomeIcon icon={icon} className="h-6 w-6" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-info">{service.name}</h2>
            <span className="text-xs text-gray-400">({service.shortName})</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-400">
              {t("services.usageCost")}: {service.usageCost}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            {service.overview}
          </p>
        </div>
        <div className="shrink-0 text-gray-400">
          <FontAwesomeIcon
            icon={isExpanded ? faChevronUp : faChevronDown}
            className="h-5 w-5"
          />
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6">
          <Section title={t("services.overview")}>
            <p className="text-sm leading-relaxed text-gray-700">
              {service.overview}
            </p>
          </Section>

          <Section title={t("services.intendedUsers")}>
            <p className="text-sm leading-relaxed text-gray-700">
              {service.intendedUsers}
            </p>
          </Section>

          <Section title={t("services.keyFeatures")}>
            <FeatureList items={service.keyFeatures} />
          </Section>
        </div>
      )}
    </div>
  );
}
