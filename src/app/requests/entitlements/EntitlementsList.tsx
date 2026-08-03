// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import List from "@/components/List";
import ListItem from "@/components/List/ListItem";
import EntitlementCard from "./EntitlementCard";
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
      {entitlements.map(
        (entitlement) =>
          entitlement.dataset && (
            <ListItem
              key={`${entitlement.dataset.id}${entitlement.start}${entitlement.end}`}
              className="bg-white mb-4 flex items-center justify-center px-2 rounded-lg shadow-lg border-b-4 border-b-[#B5BFC4] hover:border-b-secondary transition hover:bg-gray-50"
            >
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
            </ListItem>
          )
      )}
    </List>
  );
}

export default EntitlementsList;
