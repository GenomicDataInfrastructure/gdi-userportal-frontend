// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';

export const createApplication = async (datasetIds: string[]): Promise<void> => {
  const requestBody = {
    datasetIds: datasetIds,
  };

  await axios.post('/api/applications', requestBody, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
