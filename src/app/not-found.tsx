// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import Error from "./error";

export default function NotFound() {
  return <Error statusCode={404} />;
}
