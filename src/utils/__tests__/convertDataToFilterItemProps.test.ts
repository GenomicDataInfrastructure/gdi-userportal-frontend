// SPDX-FileCopyrightText: 2024 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import { faBook, faUser } from '@fortawesome/free-solid-svg-icons';
import { convertDataToFilterItemProps } from '../convertDataToFilterItemProps';
import { Facet, FacetGroup } from '@/services/discovery/types/datasetSearch.types';

describe('Map field details objects to filter item props', () => {
  it('should map field details to filter item props', () => {
    const groupKey = 'ckan';
    const facets = [
      {
        key: 'publisher_name',
        label: 'Publishers',
        values: [
          { label: 'publisherName', value: 'adeling NKR-analyse' },
          { label: 'publisherName', value: 'Centro Nacional de Epidemiología' },
          { label: 'publisherName', value: 'sciensano Network of General Practitioners team' },
        ],
      },
      {
        key: 'organization',
        label: 'Catalogues',
        values: [
          { label: 'organization', value: 'EU' },
          { label: 'organization', value: 'lumc' },
          { label: 'organization', value: 'Umcg' },
        ],
      },
    ] as Facet[];

    const facetGroup = {
      key: groupKey,
      facets: facets,
    } as FacetGroup;

    const fieldToIconMap = {
      publisher_name: faUser,
      organization: faBook,
    };

    const expected = [
      {
        field: 'publisher_name',
        label: 'Publishers',
        groupKey: groupKey,
        data: [
          {
            label: 'publisherName',
            value: 'adeling NKR-analyse',
          },
          {
            label: 'publisherName',
            value: 'Centro Nacional de Epidemiología',
          },
          {
            label: 'publisherName',
            value: 'sciensano Network of General Practitioners team',
          },
        ],
        icon: faUser,
      },
      {
        field: 'organization',
        label: 'Catalogues',
        groupKey: groupKey,
        data: [
          {
            label: 'organization',
            value: 'EU',
          },
          {
            label: 'organization',
            value: 'lumc',
          },
          {
            label: 'organization',
            value: 'Umcg',
          },
        ],
        icon: faBook,
      },
    ];

    const result = convertDataToFilterItemProps(fieldToIconMap, facetGroup);

    expect(result).toEqual(expected);
  });
  it('should return object with empty data for facet with empty values', () => {
    const groupKey = 'ckan';
    const facets = [
      {
        key: 'publisher_name',
        label: 'Publishers',
        values: [],
      },
    ];

    const facetGroup = {
      key: groupKey,
      facets: facets,
      label: '',
    } as FacetGroup;

    const fieldToIconMap = {
      publisher_name: faUser,
    };

    const expected = [
      {
        field: 'publisher_name',
        label: 'Publishers',
        groupKey: groupKey,
        data: [],
        icon: faUser,
      },
    ];

    const result = convertDataToFilterItemProps(fieldToIconMap, facetGroup);

    expect(result).toEqual(expected);
  });

  it('should return object with undefined icon if field of facet object is not in keys of fieldToIconMap object', () => {
    const facets = [
      {
        key: 'publisher_name',
        label: 'Publishers',
        values: [],
      },
    ];

    const facetGroup = {
      key: '',
      facets: facets,
      label: '',
    } as FacetGroup;

    const fieldToIconMap = {
      organization: faBook,
    };

    const expected = [
      {
        field: 'publisher_name',
        label: 'Publishers',
        groupKey: '',
        data: [],
        icon: undefined,
      },
    ];

    const result = convertDataToFilterItemProps(fieldToIconMap, facetGroup);

    expect(result).toEqual(expected);
  });
});
