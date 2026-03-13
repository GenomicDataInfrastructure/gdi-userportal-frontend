// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

type ErrorWithContext = Error & {
  code?: string;
  errno?: string | number;
  syscall?: string;
  hostname?: string;
  host?: string;
  port?: string | number;
};

export const formatErrorDetails = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const details = [error.message];
  const cause = error.cause;

  if (cause instanceof Error) {
    const contextualCause = cause as ErrorWithContext;
    const context = [
      typeof contextualCause.code === "string"
        ? `code=${contextualCause.code}`
        : null,
      typeof contextualCause.errno === "string" ||
      typeof contextualCause.errno === "number"
        ? `errno=${contextualCause.errno}`
        : null,
      typeof contextualCause.syscall === "string"
        ? `syscall=${contextualCause.syscall}`
        : null,
      typeof contextualCause.hostname === "string"
        ? `hostname=${contextualCause.hostname}`
        : null,
      typeof contextualCause.host === "string"
        ? `host=${contextualCause.host}`
        : null,
      typeof contextualCause.port === "string" ||
      typeof contextualCause.port === "number"
        ? `port=${contextualCause.port}`
        : null,
    ].filter(Boolean);

    const causeText = context.length
      ? `${cause.message} (${context.join(", ")})`
      : cause.message;

    if (causeText && causeText !== error.message) {
      details.push(`cause: ${causeText}`);
    }
  }

  return details.join(" | ");
};

export const wrapError = (message: string, cause: unknown): Error =>
  new Error(message, { cause });
