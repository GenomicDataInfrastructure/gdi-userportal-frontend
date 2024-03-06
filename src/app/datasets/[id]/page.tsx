// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import Error from "@/app/error";
import Chips from "@/components/Chips";
import PageHeading from "@/components/PageHeading";
import PageSubHeading from "@/components/PageSubHeading";
import { datasetGet } from "@/services/ckan/index.server";
import DistributionAccordion from "./DistributionAccordion";
import Sidebar from "./Sidebar";
import AddToBasketBtn from "./AddToBasketBtn";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const dataset = await datasetGet(id);

    return (
      <div className="flex w-full flex-col items-start p-10 lg:flex-row">
        <div className="flex w-full flex-col gap-5 p-5 lg:w-2/3">
          <div className="flex w-full flex-col items-start justify-between lg:flex-row lg:items-center">
            <PageHeading className="w-2/3 sm:mb-4">{dataset.title}</PageHeading>
            <AddToBasketBtn dataset={dataset} />
          </div>
          <p>{dataset.notes}</p>
          {dataset.theme?.length > 0 && <PageSubHeading>Themes</PageSubHeading>}
          <Chips chips={dataset.theme || []} />
          {dataset.keywords?.length > 0 && (
            <PageSubHeading>Keywords</PageSubHeading>
          )}
          <Chips
            chips={
              dataset.keywords?.map((keyword) => keyword.displayName) || []
            }
          />
          {dataset.distributions.length > 0 && (
            <PageSubHeading>Distributions</PageSubHeading>
          )}
          <DistributionAccordion distributions={dataset.distributions || []} />
        </div>
        <Sidebar dataset={dataset} />
      </div>
    );
  } catch (error) {
    return <Error statusCode={404} />;
  }
}
