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

const AddParticipantForm = ({
  application,
}: {
  application: RetrievedApplication;
}) => {
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
        message: "Invitation sent successfully",
      });
      closeForm();
    } catch (error: Error | unknown) {
      const err = error as Error;
      setAlert({
        type: "error",
        message: "Failed to invite member",
        details: err.message === "Failed to invite member" ? "" : err.message,
      });
    }
  };

  return (
    <>
      {!isAddParticipantFormShown && (
        <Button
          type="primary"
          text="Add Participant"
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
            placeholder="Name"
          />
          <Input
            value={currentAddParticipantEmail}
            onChange={(e) => setCurrentAddParticipantEmail(e.target.value)}
            type="text"
            placeholder="Email"
          />
          <div className="flex gap-2 self-end">
            {isAddParticipantFormShown && (
              <Button
                type="primary"
                text="Cancel"
                onClick={() => closeForm()}
              />
            )}
            <Button
              type="primary"
              text="Send"
              onClick={() => handleInviteMember()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AddParticipantForm;
