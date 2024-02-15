// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  function getNameFirstLetters(name: string | undefined | null) {
    if (!name) return "";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  }

  return (
    <>
      {session ? (
        <div className="mt-4 w-max rounded-full bg-scampi-blue p-3 text-white">
          {getNameFirstLetters(session?.user?.name)}
        </div>
      ) : (
        <p> Log in first</p>
      )}
    </>
  );
}
