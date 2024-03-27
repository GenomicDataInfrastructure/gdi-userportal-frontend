// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

function ApplicationDetailsContainer() {
  return (
    <div className="flex flex-col gap-y-8 ">
      <div className="flex flex-col gap-y-2">
        <h3 className="mb-3 text-2xl text-primary">Datasets</h3>
        <p className="text-sm">Dataset 1</p>
        <p className="text-sm">Dataset 2</p>
        <p className="text-sm">Dataset 3</p>
      </div>
      <div className="flex flex-col gap-y-2">
        <h3 className="mb-3 text-2xl text-primary">Applicant</h3>
        <p className="text-sm">Applicant 1</p>
      </div>
      <div className="flex flex-col gap-y-2">
        <h3 className="mb-3 text-2xl text-primary">Events</h3>
        <p className="text-sm">Event 1</p>
        <p className="text-sm">Event 2</p>
      </div>
    </div>
  );
}

export default ApplicationDetailsContainer;
