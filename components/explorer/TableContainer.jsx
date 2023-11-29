import React from 'react'
import { useQuery, gql } from '@apollo/client'
import Table from './Table'
import Error from './Error'
import Query from 'graphql-query-builder'

function TableContainer({
    dataset,
    schema,
    filter,
    total,
    offset,
    setOffset,
    setPage,
    page,
    orderColumnRef,
    orderByRef,
    filterTable,
    footnotes,
}) {
    const datasetQuery = new Query(dataset)
        .find(schema.fields.map((item) => item.name))
        .filter(Object.assign(filter, { limit: 100, offset }))

    //since order _by format is asc and desc but the graphql string
    //containd this format as 'asc' and 'desc' this will always give error
    //hence we check theis string and remove the quote

    let queryString = datasetQuery.toString()

    if (queryString.includes('"asc"')) {
        queryString = queryString.replace(/"asc"/g, 'asc')
    } else {
        queryString = queryString.replace(/"desc"/g, 'desc')
    }

    const QUERY = gql`
    query Dataset {
      ${queryString}
    }
  `

    const { loading, error, data } = useQuery(QUERY)

    if (loading)
        return (
            <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                height={24}
                width={24}
                stroke='currentColor'
                className='w-6 h-6 animate-spin'
            >
                <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99'
                />
            </svg>
        )

    if (error) {
        return <Error error={error} />
    }

    return (
        <div>
            <div className='overflow-auto table-container'>
                <Table
                    data={data[`${dataset}`]}
                    schema={schema}
                    dataset={dataset}
                    total={total}
                    page={page}
                    orderByRef={orderByRef}
                    orderColumnRef={orderColumnRef}
                    filterTable={filterTable}
                    footnotes={footnotes}
                />
            </div>
            <div className='data-explorer-pagination'>
                <button
                    className='first-button'
                    onClick={() => {
                        setPage(0)
                        setOffset(0)
                    }}
                    disabled={page === 0}
                >
                    First
                </button>
                <button
                    className='prev-button'
                    onClick={() => {
                        setPage(page - 1)
                        setOffset((page - 1) * 100)
                    }}
                    disabled={page === 0}
                >
                    Previous
                </button>
                <div className='page-number'>{page + 1}</div>
                <button
                    className='next-button'
                    onClick={() => {
                        setPage(page + 1)
                        setOffset((page + 1) * 100)
                    }}
                    disabled={page >= Math.floor(total / 100)}
                >
                    Next
                </button>
                <button
                    className='last-button'
                    onClick={() => {
                        const totalPages = Math.floor(total / 100)
                        setPage(totalPages)
                        setOffset(totalPages * 100)
                    }}
                    disabled={page >= Math.floor(total / 100)}
                >
                    Last
                </button>
            </div>
        </div>
    )
}

export default TableContainer
