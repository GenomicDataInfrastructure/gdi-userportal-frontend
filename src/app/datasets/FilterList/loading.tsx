// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export default function Loading() {
  return (
    <div className="col-start-0 col-span-12 flex flex-col gap-4 sm:block xl:hidden">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="col-start-0 col-span-12 mt-5 h-12 bg-gray-200 animate-pulse rounded-lg"
        ></div>
      ))}
    </div>
  );
}
