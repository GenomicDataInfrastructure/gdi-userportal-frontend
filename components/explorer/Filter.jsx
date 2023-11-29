import React, { useState } from 'react'
import { SelectFilter, OrderBy, TotalRows } from './FilterComponents'
import CopyButton from './CopyButton'

function Filter({
    dataset,
    schema,
    filter,
    setFilter,
    total,
    setTotal,
    setOffset,
    setPage,
    orderColumnRef,
    filterTable,
    orderByRef,
    copyDisabled,
    setInputStates,
    inputStates, 
    setCopyDisabled
}) {
    const newFilter = {}

    if (filter && filter.where) Object.assign(newFilter, { where: filter.where })

    const [addRules, setAddRules] = useState(false)

    const logics = {
        '==': '_eq',
        '<': '_lt',
        '>': '_gt',
        '<=': '_lte',
        '!=': '_neq',
        '>=': '_gte',
    }

    const resetFilter = function () {
        // to ensure default filter ordering
        // will set the filter back to the
        // date[time] ordering in desc order
        let initialFilter = {}
        const datetime = schema.fields.filter((val) => {
            return val.type === 'datetime' || val.type === 'date'
        })
        if (datetime.length > 0) {
            initialFilter = { order_by: { [datetime[0].name]: 'desc' } }
        }
        // reset the inputstates to one if multiple exist
        if (inputStates[0].inputValue.length || inputStates.length > 1) {
            setInputStates([{ columnName: [''], logicValue: [], inputValue: [] }])
            setOffset(0)
            setPage(0)
            setAddRules(false)
            setFilter(initialFilter)
            setCopyDisabled(false)
        }
    }

    const handleRules = function () {
        setInputStates((prevState) => {
            const newState = prevState.slice()
            newState.push({ columnName: [''], logicValue: ['_eq'], inputValue: [] })
            return newState
        })
        setAddRules(true)
    }

    return (
        <div className='dq-main-container'>
            <div className='dq-heading'>
                <div className='dq-heading-main'></div>
                <TotalRows newFilter={newFilter} dataset={dataset} setTotal={setTotal} total={total} />
            </div>
            <div className='filters-container'>
                <form>
                    <div data-testid='all-fields'>
                        {schema.fields[0].type.startsWith('date') && (
                            <div className='dq-date-picker'>
                                <SelectFilter
                                    setInputStates={setInputStates}
                                    fields={schema.fields}
                                    logics={logics}
                                    inputState={inputStates[0]}
                                    inputStates={inputStates}
                                    index={0}
                                    setAddRules={setAddRules}
                                    setCopyDisabled={setCopyDisabled}
                                />
                            </div>
                        )}

                        <div className='dq-body'>
                            {addRules ? (
                                inputStates.slice(1).map((value, index) => {
                                    return (
                                        <SelectFilter
                                            setInputStates={setInputStates}
                                            fields={schema.fields}
                                            logics={logics}
                                            inputState={value}
                                            inputStates={inputStates}
                                            index={index + 1}
                                            key={index + 1}
                                            setAddRules={setAddRules}
                                            setCopyDisabled={setCopyDisabled}
                                        />
                                    )
                                })
                            ) : (
                                <button
                                    className='border border-black rounded py-1 px-2 dq-rule-add'
                                    onClick={() => handleRules()}
                                    data-testid='rules'
                                >
                                    Add a rule
                                </button>
                            )}
                        </div>
                    </div>
                </form>
                <OrderBy orderColumnRef={orderColumnRef} orderByRef={orderByRef} fields={schema.fields} />
            </div>
            <div className='my-4 dq-rule-submit dq-footer'>
                <span className='relative z-0 inline-flex shadow-sm rounded-md w-full'>
                    <button
                        type='button'
                        onClick={() => {
                            filterTable()
                        }}
                        className='relative inline-flex items-center px-4 py-2 rounded-l border border-black hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500n'
                    >
                        Submit
                    </button>
                    <button
                        type='button'
                        onClick={() => {
                            resetFilter()
                        }}
                        className='-ml-px relative inline-flex items-center px-4 py-2 border border-black hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'
                    >
                        Reset
                    </button>
                    <CopyButton dataset={dataset} schema={schema} filter={filter} disabled={copyDisabled} />
                </span>
            </div>
        </div>
    )
}

export default Filter
