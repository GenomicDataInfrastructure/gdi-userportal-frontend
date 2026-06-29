// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import Button from "@/components/Button";
import { Input } from "@/components/shadcn/input";
import {
  InviteMember,
  RetrievedApplication,
} from "../../api/access-management/open-api/schemas";
import { inviteMemberApi } from "../../api/access-management";
import { useAlert } from "@/providers/AlertProvider";
import { useState } from "react";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";

const AddParticipantForm = ({
  application,
}: {
  application: RetrievedApplication;
}) => {
  const t = useTranslations("application");
  const tCommon = useTranslations("common");
  const [isAddParticipantFormShown, showAddParticipantForm] = useState(false);
  const [currentAddParticipantName, setCurrentAddParticipantName] =
    useState("");
  const [currentAddParticipantEmail, setCurrentAddParticipantEmail] =
    useState("");

  const { setAlert } = useAlert();

  const toggleShowParticipantForm = () => {
    showAddParticipantForm(!isAddParticipantFormShown);
  };

  const closeForm = async () => {
    setCurrentAddParticipantName("");
    setCurrentAddParticipantEmail("");
    showAddParticipantForm(false);
  };

  const handleInviteMember = async () => {
    const applicationId = application?.id;

    if (!applicationId) {
      return;
    }

    try {
      const body: InviteMember = {
        name: currentAddParticipantName,
        email: currentAddParticipantEmail,
      };

      await inviteMemberApi(applicationId, body);

      setAlert({
        type: "success",
        message: t("invitationSentSuccessfully"),
      });
      closeForm();
    } catch (error: Error | unknown) {
      const err = error as Error;
      setAlert({
        type: "error",
        message: t("failedToInviteMember"),
        details: err.message === "Failed to invite member" ? "" : err.message,
      });
    }
  };

  return (
    <>
      {!isAddParticipantFormShown && (
        <Button
          type="primary"
          text={t("addParticipant")}
          icon={faUserPlus}
          onClick={() => toggleShowParticipantForm()}
        />
      )}
      {isAddParticipantFormShown && (
        <div className="flex flex-col gap-2 items-center">
          <Input
            value={currentAddParticipantName}
            onChange={(e) => setCurrentAddParticipantName(e.target.value)}
            type="text"
            placeholder={t("namePlaceholder")}
          />
          <Input
            value={currentAddParticipantEmail}
            onChange={(e) => setCurrentAddParticipantEmail(e.target.value)}
            type="text"
            placeholder={t("emailPlaceholder")}
          />
          <div className="flex gap-2 self-end">
            {isAddParticipantFormShown && (
              <Button
                type="primary"
                text={tCommon("cancel")}
                onClick={() => closeForm()}
              />
            )}
            <Button
              type="primary"
              text={tCommon("send")}
              onClick={() => handleInviteMember()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AddParticipantForm;
