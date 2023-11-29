import React, { useState, useEffect } from 'react';
import fileDownload from 'js-file-download';
import Query from 'graphql-query-builder';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

export default function Download({ dataset, schema, filter, apiUri, withFootnotes }) {
    // Remove offset and limit from filter:
    const copyOfFilter = JSON.parse(JSON.stringify(filter));
    delete copyOfFilter.limit;
    delete copyOfFilter.offset;

    const downloadQuery = new Query(dataset).find(schema.fields.map((item) => item.name)).filter(copyOfFilter);

    let queryString = downloadQuery.toString();

    if (queryString.includes('asc')) {
        queryString = queryString.replace('"asc"', 'asc');
    } else {
        queryString = queryString.replace('"desc"', 'desc');
    }

    const [format, setFormat] = useState('csv');
    const options = ['json', 'csv', 'xlsx'];
    const [showSpinner, setShowSpinner] = useState(false);

    const handleChange = (event) => {
        setFormat(event.target.value);
    };

    const downloadData = (extension, includeFootnotes) => {
        setShowSpinner(true);
        fetch(`${apiUri}/download?format=${extension || format}&footnotes=${includeFootnotes ? 'true' : 'false'}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            responseType: 'blob',
            body: JSON.stringify({
                query: `query Dataset {
                    ${queryString}
                    }
                  `,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    setShowSpinner(false);
                    throw new Error(response.statusText);
                }
                return response.blob();
            })
            .then((blob) => {
                fileDownload(blob, `${dataset}_${new Date().toLocaleDateString()}.${extension || format}`);
                setShowSpinner(false);
            })
            .catch((error) => setShowSpinner(false));
    };

    useEffect(() => {
        // Add event listener to Download buttons outside of React app
        const downloadButtons = document.getElementsByClassName('download-data');
        for (let button of downloadButtons) {
            // When query string is changed, we need to re-attach click event listner
            // to the download buttons. We also need to remove all old event listners.
            // Cloning and replacing the button is one of the options of doing so and
            // it is efficient enough as the element doesn't have children.
            const newButton = button.cloneNode(true);
            const downloadFunction = () => {
                downloadData(newButton.value);
            };
            newButton.addEventListener('click', downloadFunction, true);
            button.parentNode.replaceChild(newButton, button);
        }
    }, [queryString]);

    return (
        <>
            {showSpinner ? (
                <div className="spinner-container">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        height={24}
                        width={24}
                        className="w-6 h-6 animate-spin"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                    </svg>
                </div>
            ) : (
                <Buttons
                    buttonTitle="Download"
                    items={
                        withFootnotes
                            ? [
                                  { name: 'Download CSV', format: 'csv' },
                                  { name: 'Download CSV(Include Footnotes)', format: 'csv', footnotes: 'yes' },
                                  { name: 'Download JSON', format: 'json' },
                                  { name: 'Download JSON(Include Footnotes)', format: 'json', footnotes: 'yes' },
                                  { name: 'Download ODS', format: 'ods' },
                                  { name: 'Download ODS(Include Footnotes)', format: 'ods', footnotes: 'yes' },
                                  { name: 'Download TSV', format: 'tsv' },
                                  { name: 'Download TSV(Include Footnotes)', format: 'tsv', footnotes: 'yes' },
                                  { name: 'Download XLSX', format: 'xlsx' },
                                  { name: 'Download XLSX(Include Footnotes)', format: 'xlsx', footnotes: 'yes' },
                              ]
                            : [
                                  { name: 'Download CSV', format: 'csv' },
                                  { name: 'Download JSON', format: 'json' },
                                  { name: 'Download ODS', format: 'ods' },
                                  { name: 'Download TSV', format: 'tsv' },
                                  { name: 'Download XLSX', format: 'xlsx' },
                              ]
                    }
                />
            )}
        </>
    );

    function Buttons({ buttonTitle, items }) {
        return (
            <div className="inline-flex items-center rounded-md">
                <button
                    type="button"
                    className="relative inline-flex items-center rounded-l-md border border-black bg-white px-3 py-2 text-sm font-medium"
                >
                    {buttonTitle}
                </button>
                <Menu as="div" className="relative -ml-px block">
                    <Menu.Button className="relative inline-flex items-center rounded-r-md border border-black bg-white px-3 py-2 text-sm font-medium">
                        <span className="sr-only">Open options</span>
                        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute left-0 z-10 mt-2 -mr-1 w-fit origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                                {items.map((item) => (
                                    <Menu.Item key={item.name}>
                                        {({ active }) => (
                                            <button
                                                onClick={() => downloadData(item.format, item.footnotes)}
                                                className={classNames(
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                    'block px-4 py-2 text-sm whitespace-nowrap'
                                                )}
                                            >
                                                {item.name}
                                            </button>
                                        )}
                                    </Menu.Item>
                                ))}
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        );
    }
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}
