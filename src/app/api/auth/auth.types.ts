// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { Account, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

export type ExtendedSession = Session & { id_token: string; access_token: string; error?: string };

export type JWTCallbackEntry = {
  token: JWT;
  account: Account | null;
};

export type SessionCallbackEntry = {
  token: JWT;
  session: Session;
};
