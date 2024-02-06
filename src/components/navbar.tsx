// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import Link from "next/link";

function Navbar() {
  return (
    <nav>
      <ul className="flex space-x-7 justify-end mr-10 mt-5">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/datasets">Datasets</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
