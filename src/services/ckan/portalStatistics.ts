// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import { constructCkanActionUrl } from './utils';
import { PortalStatistics } from './types/portalStatistics.types';

export const makePortalStatistics = (DMS: string) => {
  return async (): Promise<PortalStatistics> => {
    const props: Array<'theme' | 'catalogue' | 'keyword'> = ['theme', 'catalogue', 'keyword'];
    const counts = await Promise.all(
      props.map(async (prop) => {
        const url = constructCkanActionUrl(DMS, `${prop}_list`);
        const response = await axios.get(url);
        return response.data.result.count;
      }),
    );

    const countsObject = props.reduce<PortalStatistics>(
      (acc, prop, index) => {
        const propKey = (prop + 's') as keyof PortalStatistics;
        acc[propKey] = counts[index];
        return acc;
      },
      {
        catalogues: 0,
        keywords: 0,
        themes: 0,
      },
    );

    return countsObject;
  };
};
