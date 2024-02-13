// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { packageShow } from "../../../services/ckan/index.server";
import Error from "./../../error";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const dataset = await packageShow(id);

    return (
      <div>
        <h1>Dataset: {dataset.title}</h1>
        <p>{dataset.description}</p>
      </div>
    );
  } catch (error) {
    return <Error statusCode={404} />;
  }
}
