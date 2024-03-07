// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Notification() {
  return (
    <div className="relative">
      <FontAwesomeIcon
        icon={faBell}
        className="text-[24px] text-info md:text-[27px]"
      />
      <div className="absolute right-0 top-0.5 h-3 w-3 rounded-full bg-primary"></div>
    </div>
  );
}

export default Notification;
