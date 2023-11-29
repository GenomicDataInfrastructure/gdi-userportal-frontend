import React, { useState } from 'react';
import DatePicker from 'react-date-picker/dist/entry.nostyle';

function DateTime({ columnName, setInputStates, index, fields, setCopyDisabled }) {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const handleDate = function (columnName, dateString, type) {
        const date = new Date(dateString);
        setCopyDisabled(true);
        if (date) {
            // Convert it into GMT considering offset
            const offset = date.getTimezoneOffset();
            const localDateTime = new Date(date.getTime() - offset * 60 * 1000);
            const ISODateTime = localDateTime.toISOString();

            if (type === 'type1') {
                setStartDate(dateString);
                setInputStates((prevState) => {
                    const newdata = prevState.slice();
                    newdata[index]['logicValue'][0] = '_gte';
                    newdata[index]['inputValue'][0] = ISODateTime;
                    return newdata;
                });
            } else {
                setEndDate(dateString);
                setInputStates((prevState) => {
                    const newdata = prevState.slice();
                    newdata[index]['logicValue'][1] = '_lt';
                    newdata[index]['inputValue'][1] = ISODateTime;
                    return newdata;
                });
            }
        } else {
            if (type === 'type1') {
                setStartDate(dateString);
                setInputStates((prevState) => {
                    const newdata = prevState.slice();
                    console.log(newdata);
                    if (newdata[index].logicValue.length >= 1) {
                        newdata[index].logicValue.splice(0, 1);
                        newdata[index].inputValue.splice(0, 1);
                    }
                    return newdata;
                });
            } else {
                setEndDate(dateString);
                setInputStates((prevState) => {
                    const newdata = prevState.slice();
                    if (newdata[index].logicValue.length === 1) {
                        newdata[index].logicValue.splice(0, 1);
                        newdata[index].inputValue.splice(0, 1);
                    } else if (newdata[index].logicValue.length > 1) {
                        newdata[index].logicValue.splice(1, 1);
                        newdata[index].inputValue.splice(1, 1);
                    }
                    return newdata;
                });
            }
        }
    };

    return (
        <>
            <input type="date" value={startDate} onChange={(e) => handleDate(columnName, e.target.value, 'type1')} />
            <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
            <input type="date" value={endDate} onChange={(e) => handleDate(columnName, e.target.value, 'type2')} />
        </>
    );
}

export default DateTime;
