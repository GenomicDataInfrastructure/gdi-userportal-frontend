// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import PageHeading from "@/components/PageHeading";
import Sidebar from "@/components/Sidebar";
import Button from "@/components/button";
import FieldAttachmentContainer from "@/components/fieldAttachmentContainer";
import { faPaperPlane, faSave } from "@fortawesome/free-solid-svg-icons";
import { createApplicationSidebarItems } from "./sidebarItems";

type ApplicationDetailsPageProps = {
  params: { id: string };
};

export default function ApplicationDetailsPage({
  params,
}: ApplicationDetailsPageProps) {
  const { id } = params;
  const sidebarItems = createApplicationSidebarItems();
  return (
    <div className="mt-20 grid grid-cols-12 gap-x-20">
      <div className="col-span-6 col-start-3">
        <div className="px-3">
          <div className="flex justify-between">
            <PageHeading>Application {id}</PageHeading>
            <div className="flex gap-x-3">
              <Button
                type="warning"
                text="Save changes"
                icon={faSave}
                className="text-xs"
              />
              <Button
                type="primary"
                text="Submit"
                className="text-xs"
                icon={faPaperPlane}
              />
            </div>
          </div>
          <p className="mt-5">Last Event: blablabla</p>
        </div>

        <div className="mt-5 h-[2px] bg-secondary opacity-80"></div>

        <FieldAttachmentContainer fieldName="Field 1" />
        <FieldAttachmentContainer fieldName="Field 2" />
        <FieldAttachmentContainer fieldName="Field 3" />
      </div>

      <aside className="col-span-3 col-start-9">
        <Sidebar items={sidebarItems} />
      </aside>
    </div>
  );
}
