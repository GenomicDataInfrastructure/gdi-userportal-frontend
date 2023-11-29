import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Error from '../Error';
import Query from 'graphql-query-builder';

function TotalRows({ newFilter, dataset, setTotal, total }) {
    const getTotalRows = new Query(`${dataset}_aggregate`).filter(newFilter).find(new Query('aggregate').find('count'));

    const QUERY = gql`
    query Dataset {
      ${getTotalRows}
    }
  `;
    const { loading, error, data } = useQuery(QUERY);

    if (loading)
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                height={24}
                width={24}
                stroke="currentColor"
                className="w-6 h-6 animate-spin"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
            </svg>
        );

    if (error) {
        return <Error error={error} />;
    }

    if (data) {
        setTotal(data[`${dataset}_aggregate`].aggregate.count);
    }

    return (
        <div data-testid="agg" className="dq-heading-total-rows my-4">
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="px-4 py-5 bg-transparent shadow rounded overflow-hidden sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total entries</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{total && total.toLocaleString()}</dd>
                </div>
            </dl>
        </div>
    );
}

export default TotalRows;
