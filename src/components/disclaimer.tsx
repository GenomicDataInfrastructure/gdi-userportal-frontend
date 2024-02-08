// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Disclaimer() {
  return (
    <div className="m-5 mt-20 md:mt-15 p-5 bg-claret text-white rounded-lg flex flex-row gap-4 items-center">
      <div className="text-2xl">
        <FontAwesomeIcon icon={faExclamationCircle} />
      </div>
      <div className="text-[14px] text-pretty">
        Please note that this version of GDI User Portal is the result of
        deliverable &quot;MS11 - Development of the user portal deployed &quot;,
        which is still undergoing further feature developments and testing
        before its release in production. Therefore, you may witness some
        instabilities and broken links. Should you have any feedback, please let
        us know so we can take into account for the future releases accordingly.
        Your help in this regard is greatly appreciated!
      </div>
    </div>
  );
}

export default Disclaimer;
