// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <p>{session ? `Welcome ${session?.user?.name}` : "Log in first"}</p>
    </>
  );
}
