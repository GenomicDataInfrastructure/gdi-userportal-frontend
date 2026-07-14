// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { cn } from "@/utils/tailwindMerge";
import {
  faEllipsisVertical,
  faFileWord,
  faRotateLeft,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

interface ApplicationOptionsMenuProps {
  disabled?: boolean;
  onExportToWord?: () => void;
  onDiscardChanges?: () => void;
  onDiscardApplication?: () => void;
}

const ApplicationOptionsMenu: React.FC<ApplicationOptionsMenuProps> = ({
  disabled,
  onExportToWord,
  onDiscardChanges,
  onDiscardApplication,
}) => {
  const t = useTranslations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={t("application.options.label")}
          className={cn(
            "flex items-center justify-center rounded-md border-2 border-primary px-4 h-10 text-sm text-primary transition-colors duration-200 hover:bg-secondary hover:text-white hover:border-transparent",
            disabled && "opacity-60 cursor-not-allowed hover:bg-transparent"
          )}
        >
          <FontAwesomeIcon icon={faEllipsisVertical} />
          <span className="ml-2 font-bold tracking-wide">
            {t("application.options.label")}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="flex items-center gap-x-2 cursor-pointer"
            onClick={onExportToWord}
          >
            <FontAwesomeIcon icon={faFileWord} className="text-lg" />
            <span>{t("application.options.exportToWord")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-x-2 cursor-pointer"
            onClick={onDiscardChanges}
          >
            <FontAwesomeIcon icon={faRotateLeft} className="text-lg" />
            <span>{t("application.options.discardChanges")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-x-2 cursor-pointer"
            onClick={onDiscardApplication}
          >
            <FontAwesomeIcon icon={faTrash} className="text-lg" />
            <span>{t("application.options.discardApplication")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ApplicationOptionsMenu;
