// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import List from "@/components/List";
import ListItem from "@/components/List/ListItem";
import { DatasetEntitlement } from "@/services/discovery/types/dataset.types";
import EntitlementCard from "./EntitlementCard";

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
            >
              <EntitlementCard
                dataset={entitlement.dataset}
                start={entitlement.start}
                end={entitlement.end}
              />
            </ListItem>
          )
      )}
    </List>
  );
}

export default EntitlementsList;
