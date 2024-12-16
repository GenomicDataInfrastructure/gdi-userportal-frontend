// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import List from "@/components/List";
import ListItem from "@/components/List/ListItem";
import EntitlementCard from "./EntitlementCard";
import { createEntitlementCardItems } from "./entitlementCardItems";
import { DatasetEntitlement } from "@/app/api/access-management/additional-types";

type EntitlementsListProps = {
  entitlements: DatasetEntitlement[];
};

function EntitlementsList({ entitlements }: Readonly<EntitlementsListProps>) {
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
              />
            </ListItem>
          )
      )}
    </List>
  );
}

export default EntitlementsList;
