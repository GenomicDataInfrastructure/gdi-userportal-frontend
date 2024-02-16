// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { datasetGet } from "@/services/ckan/index.server";
import Error from "@/app/error";
import PageHeading from "@/components/PageHeading";
import PageSubHeading from "@/components/PageSubHeading";
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
        </div>
        <div className="flex w-full flex-col gap-3 bg-gray-100 p-5 lg:w-1/3">
          {/* Example for author, similar structure for other sidebar details */}
          <div>
            <h3 className="font-semibold">Author</h3>
            <span>{dataset.author.name}</span>
          </div>
          {/* Add other details similarly */}
        </div>
      </div>
    );
  } catch (error) {
    return <Error statusCode={404} />;
  }
}
