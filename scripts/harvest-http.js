// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

const { Agent } = require("undici");

const HARVEST_REQUEST_TIMEOUT_MS = 600000;
const harvestDispatcher = new Agent({
  connect: { rejectUnauthorized: false },
});

function buildHarvestApiUrl(baseUrl) {
  return `${String(baseUrl).replace(/\/+$/, "")}/api/discovery/harvest`;
}

function formatErrorDetails(error) {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const details = [error.message];
  let currentCause = error.cause;

  while (currentCause instanceof Error) {
    const context = [
      typeof currentCause.code === "string"
        ? `code=${currentCause.code}`
        : null,
      typeof currentCause.errno === "string" ||
      typeof currentCause.errno === "number"
        ? `errno=${currentCause.errno}`
        : null,
      typeof currentCause.syscall === "string"
        ? `syscall=${currentCause.syscall}`
        : null,
      typeof currentCause.hostname === "string"
        ? `hostname=${currentCause.hostname}`
        : null,
      typeof currentCause.host === "string"
        ? `host=${currentCause.host}`
        : null,
      typeof currentCause.port === "string" ||
      typeof currentCause.port === "number"
        ? `port=${currentCause.port}`
        : null,
    ].filter(Boolean);

    details.push(
      context.length
        ? `cause: ${currentCause.message} (${context.join(", ")})`
        : `cause: ${currentCause.message}`
    );
    currentCause = currentCause.cause;
  }

  return details.join(" | ");
}

function truncateText(value, limit = 400) {
  if (typeof value !== "string") {
    return "";
  }

  const compact = value.replace(/\s+/g, " ").trim();
  if (!compact) {
    return "";
  }

  return compact.length > limit ? `${compact.slice(0, limit)}...` : compact;
}

async function requestHarvest(
  { apiUrl, sourceUrl, secret },
  { fetchImpl = fetch, timeoutMs = HARVEST_REQUEST_TIMEOUT_MS } = {}
) {
  const timeoutController = new AbortController();
  const timeout = setTimeout(() => timeoutController.abort(), timeoutMs);

  let response;
  try {
    response = await fetchImpl(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-harvest-secret": secret,
      },
      body: JSON.stringify({ url: sourceUrl }),
      signal: timeoutController.signal,
      dispatcher: harvestDispatcher,
    });
  } catch (error) {
    throw new Error(
      [
        `Failed to call harvest API at ${apiUrl}`,
        `requested catalogue URL: ${sourceUrl}`,
        `details: ${formatErrorDetails(error)}`,
      ].join("\n"),
      { cause: error }
    );
  } finally {
    clearTimeout(timeout);
  }

  let responseText = "";
  try {
    responseText = await response.text();
  } catch (error) {
    throw new Error(
      [
        `Failed to read harvest API response from ${apiUrl}`,
        `status: ${response.status} ${response.statusText}`,
        `requested catalogue URL: ${sourceUrl}`,
        `details: ${formatErrorDetails(error)}`,
      ].join("\n"),
      { cause: error }
    );
  }

  let payload = {};
  try {
    payload = responseText ? JSON.parse(responseText) : {};
  } catch (error) {
    throw new Error(
      [
        `Harvest API at ${apiUrl} returned invalid JSON`,
        `status: ${response.status} ${response.statusText}`,
        `requested catalogue URL: ${sourceUrl}`,
        `body: ${truncateText(responseText) || "<empty>"}`,
        `details: ${formatErrorDetails(error)}`,
      ].join("\n"),
      { cause: error }
    );
  }

  if (!response.ok) {
    const responseError =
      typeof payload?.error === "string" && payload.error.trim()
        ? payload.error.trim()
        : truncateText(responseText);

    throw new Error(
      [
        `Harvest trigger failed via ${apiUrl}`,
        `status: ${response.status} ${response.statusText}`,
        `requested catalogue URL: ${sourceUrl}`,
        `error: ${responseError || response.statusText}`,
      ].join("\n")
    );
  }

  return Number(payload?.count ?? 0);
}

module.exports = {
  buildHarvestApiUrl,
  formatErrorDetails,
  requestHarvest,
  truncateText,
};
