// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { FilterItemProps } from '@/components/filterItem';
import { FieldDetails } from '@/services/ckan/types/fieldDetails.types';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

function convertDataToFilterItemProps(data: FieldDetails[], fieldToIconMap: Record<string, IconDefinition>): FilterItemProps[] {
  return data.map((fieldDetails: FieldDetails) => {
    return {
      label: fieldDetails.field.charAt(0).toUpperCase() + fieldDetails.field.slice(1) + 's',
      data: fieldDetails.values.map((v: string) => {
        return {
          label: v.charAt(0).toUpperCase() + v.slice(1),
          value: v,
        };
      }),
      icon: fieldToIconMap[fieldDetails.field],
    };
  });
}

export { convertDataToFilterItemProps };
