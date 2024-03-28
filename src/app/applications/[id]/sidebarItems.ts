// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { SidebarItem } from '@/components/Sidebar';

function createApplicationSidebarItems(): SidebarItem[] {
  return [
    {
      label: 'Dataset',
      value: ['Dataset 1', 'Dataset 2', 'Dataset 3'],
      isLink: false,
    },
    {
      label: 'Participant',
      value: 'Participant 1',
      isLink: false,
    },
    {
      label: 'Events',
      value: ['Event 1', 'Event 2', 'Event 3'],
      isLink: false,
    },
  ];
}

export { createApplicationSidebarItems };
