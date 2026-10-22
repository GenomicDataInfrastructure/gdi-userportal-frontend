// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faCogs,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";
import { DiscoveryModelTask } from "@/app/api/discovery/providers/types";

type ModelTasksAccordionProps = {
  modelTasks: DiscoveryModelTask[];
};

type GroupedTask = {
  task: DiscoveryModelTask["task"];
  subtasks: NonNullable<DiscoveryModelTask["subtask"]>[];
};

type GroupedModality = {
  modality: DiscoveryModelTask["modality"];
  tasks: GroupedTask[];
};

export const groupModelTasks = (
  modelTasks: DiscoveryModelTask[]
): GroupedModality[] => {
  const modalities: GroupedModality[] = [];

  for (const entry of modelTasks) {
    let modalityGroup = modalities.find(
      (group) => group.modality.value === entry.modality.value
    );
    if (!modalityGroup) {
      modalityGroup = { modality: entry.modality, tasks: [] };
      modalities.push(modalityGroup);
    }

    let taskGroup = modalityGroup.tasks.find(
      (group) => group.task.value === entry.task.value
    );
    if (!taskGroup) {
      taskGroup = { task: entry.task, subtasks: [] };
      modalityGroup.tasks.push(taskGroup);
    }

    if (
      entry.subtask &&
      !taskGroup.subtasks.some(
        (subtask) => subtask.value === entry.subtask?.value
      )
    ) {
      taskGroup.subtasks.push(entry.subtask);
    }
  }

  return modalities;
};

export default function ModelTasksAccordion({
  modelTasks,
}: Readonly<ModelTasksAccordionProps>) {
  const t = useTranslations("aiModels");
  const [openValues, setOpenValues] = useState<Set<string>>(new Set());
  const [fullyOpenValues, setFullyOpenValues] = useState<Set<string>>(
    new Set()
  );
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const groups = useMemo(() => groupModelTasks(modelTasks), [modelTasks]);

  useEffect(() => {
    const values = new Set(groups.map((group) => group.modality.value));
    for (const key of Object.keys(contentRefs.current)) {
      if (!values.has(key)) delete contentRefs.current[key];
    }
  }, [groups]);

  const toggleItem = (value: string) => {
    setOpenValues((current) => {
      const next = new Set(current);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
    setFullyOpenValues((current) => {
      const next = new Set(current);
      next.delete(value);
      return next;
    });
  };

  return (
    <div className="accordion w-full">
      {groups.map((group) => {
        const value = group.modality.value;
        const isOpen = openValues.has(value);
        const isFullyOpen = fullyOpenValues.has(value);

        return (
          <div
            className="w-full border-b border-primary/20 last:border-b-0"
            key={value}
          >
            <button
              type="button"
              onClick={() => toggleItem(value)}
              className={`flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-3 text-left transition-colors ${
                isOpen ? "bg-hover" : "hover:bg-hover"
              }`}
              aria-expanded={isOpen}
            >
              <span className="flex items-center">
                <FontAwesomeIcon icon={faCogs} className="text-primary" />
                <span className="ml-2 break-all font-medium">
                  {group.modality.label}
                </span>
              </span>
              <FontAwesomeIcon
                icon={isOpen ? faChevronUp : faChevronDown}
                className="text-primary"
              />
            </button>
            <div
              ref={(el: HTMLDivElement | null) => {
                contentRefs.current[value] = el;
              }}
              onTransitionEnd={() => {
                if (openValues.has(value)) {
                  setFullyOpenValues((current) => new Set(current).add(value));
                }
              }}
              style={{
                maxHeight: isOpen
                  ? `${contentRefs.current[value]?.scrollHeight}px`
                  : "0",
                overflow: isFullyOpen ? "visible" : "hidden",
                transition: "max-height 0.5s ease",
              }}
            >
              <div className="px-2 pb-4">
                <div className="ml-3 border-l-2 border-primary/20 pl-4 flex flex-col gap-4">
                  {group.tasks.map((taskGroup) => (
                    <div key={taskGroup.task.value}>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faTasks}
                          className="text-primary align-middle"
                        />
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          {t("tasks")}
                        </span>
                        <strong className="text-sm font-semibold">
                          {taskGroup.task.label}
                        </strong>
                      </div>
                      <div className="mt-2 ml-6">
                        {taskGroup.subtasks.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              {t("subtasks")}:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {taskGroup.subtasks.map((subtask) => (
                                <span
                                  key={subtask.value}
                                  className="bg-warning bg-opacity-50 px-4 py-1 rounded-full text-gray font-medium text-[14px] inline-block"
                                >
                                  {subtask.label}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray italic">
                            {t("noSubtasks")}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
