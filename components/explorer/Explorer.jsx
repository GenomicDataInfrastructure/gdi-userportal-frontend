import React, { useRef, useState } from 'react'
import Download from './Download'
import Filter from './Filter'
import TableContainer from './TableContainer'

function Explorer({ dataset, schema, apiUri, footnotes }) {
    // Sort by the given list of primary keys
    let initialFilter = {}
    if (schema.primary_key) {
        initialFilter = {
            order_by: schema.primary_key.map((pk) => {
                return { [pk]: 'desc' }
            }),
        }
    } else {
        // No primary keys exist so order by datetime field if exist
        const datetime = schema.fields.filter((val) => {
            return val.type === 'datetime' || val.type === 'date'
        })
        if (datetime.length > 0) {
            initialFilter = { order_by: { [datetime[0].name]: 'desc' } }
        }
    }

    const [filter, setFilter] = useState(initialFilter)
    const [copyDisabled, setCopyDisabled] = useState(false)
    const [total, setTotal] = useState(0)
    const [offset, setOffset] = useState(0)
    const [page, setPage] = useState(0)
    const orderColumnRef = useRef()
    const orderByRef = useRef()
    const [inputStates, setInputStates] = useState([{ columnName: [''], logicValue: [], inputValue: [] }])

    const filterTable = function () {
        setCopyDisabled(false)
        const whereVariables = {}
        const filterVariables = {}
        inputStates.forEach((value, index) => {
            if (value.inputValue[0]) {
                // ensure no empty input value
                whereVariables[value.columnName[0]] = {}
                value.logicValue.forEach((val, index) => {
                    const logic = value.logicValue[index]
                    const input = value.inputValue[index]
                    whereVariables[value.columnName[0]][logic] = input
                })
            } else if (value.inputValue.length === 2 && value.inputValue[1]) {
                //if the first inputvalue for date[time] is undefined
                // hence the second index must contain a date[time] value
                whereVariables[value.columnName[0]] = {}
                const logic = value.logicValue[1]
                const input = value.inputValue[1]
                whereVariables[value.columnName[0]][logic] = input
            }
        })
        filterVariables['where'] = whereVariables

        const whereKeys = Object.keys(whereVariables)
        const length = whereKeys.length
        const isFilled = length === 1 ? whereKeys[0].length : true

        if (isFilled) {
            filterVariables['where'] = whereVariables
        }

        const orderColumn = orderColumnRef.current.value
        const orderBy = orderByRef.current.value
        filterVariables['order_by'] = { [orderColumn]: orderBy }
        filterVariables['limit'] = 100
        setFilter(filterVariables)
    }

    return (
        <div>
            <p data-testid='hidden-test'></p>
            <Download dataset={dataset} schema={schema} filter={filter} apiUri={apiUri} withFootnotes={footnotes ? true : false} />
            <Filter
                dataset={dataset}
                schema={schema}
                filter={filter}
                setFilter={setFilter}
                total={total}
                setTotal={setTotal}
                setOffset={setOffset}
                setPage={setPage}
                orderColumnRef={orderColumnRef}
                orderByRef={orderByRef}
                filterTable={filterTable}
                copyDisabled={copyDisabled}
                setInputStates={setInputStates}
                inputStates={inputStates}
                setCopyDisabled={setCopyDisabled}
            />
            <TableContainer
                dataset={dataset}
                schema={schema}
                filter={filter}
                total={total}
                offset={offset}
                setOffset={setOffset}
                setPage={setPage}
                page={page}
                setTotal={setTotal}
                orderColumnRef={orderColumnRef}
                orderByRef={orderByRef}
                filterTable={filterTable}
                footnotes={footnotes}
            />
        </div>
    )
}

export default Explorer
