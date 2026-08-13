// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import List from "@/components/List";
import ListItem from "@/components/List/ListItem";
import EntitlementCard from "./EntitlementCard";
import FallbackEntitlementCard from "./FallbackEntitlementCard";
import {
  createEntitlementCardItems,
  formatEntitlementSourceLabel,
} from "./entitlementCardItems";
import { DatasetEntitlement } from "@/app/api/access-management/additional-types";
import { useTranslations } from "next-intl";

type EntitlementsListProps = {
  entitlements: DatasetEntitlement[];
};

function EntitlementsList({ entitlements }: Readonly<EntitlementsListProps>) {
  const t = useTranslations("requests.entitlements");
  return (
    <List>
      {entitlements.map((entitlement, index) => {
        const key = entitlement.dataset
          ? `${entitlement.dataset.id}${entitlement.start}${entitlement.end}`
          : `fallback-${entitlement.datasetId ?? index}`;

        return (
          <ListItem
            key={key}
            className="bg-white mb-4 flex items-center justify-center px-2 rounded-lg shadow-lg border-b-4 border-b-[#B5BFC4] hover:border-b-secondary transition hover:bg-gray-50"
          >
            {entitlement.dataset ? (
              <EntitlementCard
                dataset={entitlement.dataset}
                cardItems={createEntitlementCardItems(
                  entitlement.dataset,
                  entitlement.start,
                  entitlement.end
                )}
                sourceLabel={formatEntitlementSourceLabel(
                  entitlement.source,
                  entitlement.by,
                  { grantedBy: t("grantedBy"), source: t("source") }
                )}
              />
            ) : (
              <FallbackEntitlementCard
                datasetId={entitlement.datasetId ?? ""}
                by={entitlement.by}
                source={entitlement.source}
              />
            )}
          </ListItem>
        );
      })}
    </List>
  );
}

export default EntitlementsList;
