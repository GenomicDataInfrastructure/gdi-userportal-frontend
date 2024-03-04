// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { faBook, faUser } from '@fortawesome/free-solid-svg-icons';
import { Field } from '../../services/ckan/types/fieldDetails.types';
import { convertDataToFilterItemProps } from '../dto';

describe('Map field details objects to filter item props', () => {
  it('should map field details to filter item props', () => {
    const fieldDetails = [
      {
        field: Field.PUBLISHER,
        values: ['adeling NKR-analyse', 'Centro Nacional de Epidemiología', 'sciensano Network of General Practitioners team'],
        count: 3,
      },
      {
        field: Field.CATALOGUE,
        values: ['EU', 'lumc', 'Umcg'],
        count: 3,
      },
    ];

    const fieldToIconMap = {
      publisher: faUser,
      catalogue: faBook,
    };

    const expected = [
      {
        label: 'Publishers',
        data: [
          {
            label: 'Adeling NKR-analyse',
            value: 'adeling NKR-analyse',
          },
          {
            label: 'Centro Nacional de Epidemiología',
            value: 'Centro Nacional de Epidemiología',
          },
          {
            label: 'Sciensano Network of General Practitioners team',
            value: 'sciensano Network of General Practitioners team',
          },
        ],
        icon: faUser,
      },
      {
        label: 'Catalogues',
        data: [
          {
            label: 'EU',
            value: 'EU',
          },
          {
            label: 'Lumc',
            value: 'lumc',
          },
          {
            label: 'Umcg',
            value: 'Umcg',
          },
        ],
        icon: faBook,
      },
    ];

    const result = convertDataToFilterItemProps(fieldDetails, fieldToIconMap);

    expect(result).toEqual(expected);
  });
  it('should return object with empty data for fieldDetails with empty values', () => {
    const fieldDetails = [
      {
        field: Field.PUBLISHER,
        values: [],
        count: 3,
      },
    ];

    const fieldToIconMap = {
      publisher: faUser,
    };

    const expected = [
      {
        label: 'Publishers',
        data: [],
        icon: faUser,
      },
    ];

    const result = convertDataToFilterItemProps(fieldDetails, fieldToIconMap);

    expect(result).toEqual(expected);
  });

  it('should return object with undefined icon if field of fieldDetails object is not in keys of fieldToIconMap object', () => {
    const fieldDetails = [
      {
        field: Field.PUBLISHER,
        values: [],
        count: 3,
      },
    ];

    const fieldToIconMap = {
      catalogue: faBook,
    };

    const expected = [
      {
        label: 'Publishers',
        data: [],
        icon: undefined,
      },
    ];

    const result = convertDataToFilterItemProps(fieldDetails, fieldToIconMap);

    expect(result).toEqual(expected);
  });
});
