// SPDX-FileCopyrightText: 2026 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Generic notification shape shown by the UI. Provider-specific payloads are
 * mapped into this contract in the server/API layer.
 */
export interface AppNotificationMeta {
  code?: string;
  applicationId?: string;
  applicationType?: string;
  rawProperties?: Record<string, unknown>;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  meta?: AppNotificationMeta;
}

export interface ListNotificationsParams {
  page?: number;
  limit?: number;
}

export interface ListNotificationsResult {
  items: AppNotification[];
  total?: number;
}
