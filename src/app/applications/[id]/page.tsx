// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import PageContainer from "@/components/PageContainer";
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
    <PageContainer>
      <div className="mx-8 md:mx-auto md:w-3/4 xl:mx-0 xl:grid xl:w-full xl:grid-cols-12 xl:gap-x-20">
        <div className="col-span-8 col-start-3 xl:col-span-6 xl:col-start-3">
          <div className="px-3">
            <div className="sm:flex sm:justify-between">
              <PageHeading>Application {id}</PageHeading>
              <div className="mt-4 flex gap-x-3 sm:mt-0">
                <Button
                  type="warning"
                  text="Save changes"
                  icon={faSave}
                  className="h-fit text-[10px] sm:text-xs"
                />
                <Button
                  type="primary"
                  text="Submit"
                  className="h-fit text-[10px] sm:text-xs"
                  icon={faPaperPlane}
                />
              </div>
            </div>
            <p className="mt-5">Last Event: blablabla</p>
          </div>

          <div className="mt-5 h-[2px] bg-secondary opacity-80"></div>

          <div className="mt-10 w-full xl:hidden">
            <Sidebar items={sidebarItems} />
          </div>

          <div className="mt-5 h-[2px] bg-secondary opacity-80 xl:hidden"></div>

          <FieldAttachmentContainer fieldName="Field 1" />
          <FieldAttachmentContainer fieldName="Field 2" />
          <FieldAttachmentContainer fieldName="Field 3" />
        </div>

        <aside className="col-span-3 col-start-9 hidden xl:block">
          <Sidebar items={sidebarItems} />
        </aside>
      </div>
    </PageContainer>
  );
}
