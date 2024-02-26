// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { datasetGet } from "@/services/ckan/index.server";
import Error from "@/app/error";
import PageHeading from "@/components/PageHeading";
import PageSubHeading from "@/components/PageSubHeading";
import Sidebar from "./Sidebar";
import DistributionAccordion from "./DistributionAccordion";
import Chips from "@/components/Chips";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const dataset = await datasetGet(id);

    return (
      <div className="flex w-full flex-col items-start p-10 lg:flex-row">
        <div className="flex w-full flex-col gap-5 p-5 lg:w-2/3">
          <PageHeading>{dataset.title}</PageHeading>
          <p>{dataset.notes}</p>
          <PageSubHeading>Themes</PageSubHeading>
          <Chips chips={dataset.theme} />
          <PageSubHeading>Keywords</PageSubHeading>
          <Chips
            chips={dataset.keywords.map((keyword) => keyword.displayName)}
          />
          <PageSubHeading>Distributions</PageSubHeading>
          <DistributionAccordion distributions={dataset.distributions} />
        </div>
        <Sidebar dataset={dataset} />
      </div>
    );
  } catch (error) {
    return <Error statusCode={404} />;
  }
}
