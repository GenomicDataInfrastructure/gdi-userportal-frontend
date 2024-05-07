// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import List from "@/components/List";
import ListContainer from "@/components/ListContainer";
import PageContainer from "@/components/PageContainer";
import PageHeading from "@/components/PageHeading";
import DatasetList from "../applications/DatasetList";

function GrantedDatasetsPage() {
  return (
    <PageContainer className="pt-5 md:pt-10">
      <PageHeading className="mb-4">Granted Datasets</PageHeading>
      <p>You have been granted access to these datasets</p>
      <ListContainer>
        <List>
          <DatasetList datasets={[]} />
        </List>
      </ListContainer>
    </PageContainer>
  );
}

export default GrantedDatasetsPage;
