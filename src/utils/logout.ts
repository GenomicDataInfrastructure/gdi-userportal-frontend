// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

export async function keycloackSessionLogOut() {
  try {
    await fetch('/api/auth/logout');
  } catch (error) {
    throw new Error(`Could not log out from Keycloak`);
  }
}
