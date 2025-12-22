// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  SearchedDataset,
  ValueLabel,
} from "@/app/api/discovery/open-api/schemas";
import { retrieveDatasetApi } from "@/app/api/discovery";
import { useWindowSize } from "@/hooks";
import { useDatasetBasket } from "@/providers/DatasetBasketProvider";
import { truncateDescription } from "@/utils/textProcessing";
import { isExternalDataset, getFirstAccessUrl } from "@/utils/datasetHelpers";
import {
  faMinusCircle,
  faPlusCircle,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card, { CardItem } from "../../components/Card";
import Link from "next/link";
import { useEffect, useState, useRef, useMemo } from "react";
import { ExternalDatasetConfirmationDialog } from "@/components/ExternalDatasetCardLink";

type DatasetCardProps = {
  dataset: SearchedDataset;
  cardItems: CardItem[];
  displayBasketButton?: boolean;
};

function DatasetCard({
  dataset,
  cardItems,
  displayBasketButton = true,
}: Readonly<DatasetCardProps>) {
  const screenSize = useWindowSize();
  const truncatedDesc = dataset.description
    ? truncateDescription(dataset.description, screenSize)
    : null;

  const { basket, addDatasetToBasket, removeDatasetFromBasket, isLoading } =
    useDatasetBasket();

  const [conformsTo, setConformsTo] = useState<ValueLabel[] | undefined>(
    dataset.conformsTo
  );
  const [fullDataset, setFullDataset] = useState<typeof dataset | undefined>(
    undefined
  );
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const isConformsToEmpty =
      conformsTo === null ||
      conformsTo === undefined ||
      (Array.isArray(conformsTo) && conformsTo.length === 0);

    const shouldFetch =
      dataset.id && !hasFetchedRef.current && isConformsToEmpty;

    if (shouldFetch) {
      hasFetchedRef.current = true;
      retrieveDatasetApi(dataset.id).then((retrievedDataset) => {
        if (retrievedDataset) {
          setConformsTo(retrievedDataset.conformsTo);
          setFullDataset(retrievedDataset);
        }
      });
    }
  }, [dataset.id, conformsTo]);

  const datasetWithConformsTo = useMemo(
    () => ({
      ...dataset,
      conformsTo: conformsTo,
    }),
    [dataset, conformsTo]
  );
  const isInBasket = basket.some((ds) => ds.id === dataset.id);
  const isExternal = isExternalDataset(datasetWithConformsTo);
  const externalAccessUrl = getFirstAccessUrl(
    fullDataset?.distributions || dataset.distributions
  );

  const toggleDatasetInBasket = (e: React.MouseEvent) => {
    e.preventDefault();
    (isInBasket ? removeDatasetFromBasket : addDatasetToBasket)(dataset);
  };

  const hasIdentifier = !!dataset.identifier;
  const buttonDisabled = isLoading || !hasIdentifier;

  const renderButton = useMemo(() => {
    return () => {
      if (!displayBasketButton) return undefined;

      if (isExternal) {
        return (
          <div onClick={(e) => e.stopPropagation()}>
            {externalAccessUrl ? (
              <ExternalDatasetConfirmationDialog url={externalAccessUrl}>
                {({ onClick }) => (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onClick(e);
                    }}
                    className="text-xs sm:text-base text-primary hover:text-info underline hover:no-underline font-semibold transition-colors duration-200 cursor-pointer shrink-0 inline-flex items-center gap-1"
                  >
                    <span>Access external dataset</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                  </button>
                )}
              </ExternalDatasetConfirmationDialog>
            ) : (
              <button
                disabled
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="text-xs sm:text-base text-gray-400 cursor-not-allowed inline-flex items-center gap-1"
              >
                <span>External link not available</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>
            )}
          </div>
        );
      }

      return (
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            if (buttonDisabled) {
              e.preventDefault();
              e.stopPropagation();
              return;
            }
            toggleDatasetInBasket(e);
          }}
          disabled={buttonDisabled}
          className={`text-xs sm:text-base rounded-md px-4 py-2 font-bold transition-colors duration-200 tracking-wide cursor-pointer shrink-0 ${buttonDisabled ? "opacity-60 cursor-not-allowed" : ""} ${isInBasket ? "bg-warning text-black hover:bg-secondary hover:text-white" : "bg-primary text-white hover:bg-secondary"}`}
        >
          <FontAwesomeIcon
            icon={isInBasket ? faMinusCircle : faPlusCircle}
            className="mr-2"
          />
          <span>{isInBasket ? "Remove from basket" : "Add to basket"}</span>
        </button>
      );
    };
  }, [
    displayBasketButton,
    isExternal,
    externalAccessUrl,
    buttonDisabled,
    isInBasket,
  ]);

  const buttonElement = renderButton();

  return (
    <Card
      url={`/datasets/${dataset.id}`}
      title={dataset.title}
      subTitles={dataset.themes
        ?.map((theme) => theme.label || theme.display_name)
        .filter((title): title is string => !!title)}
      description={truncatedDesc || "No description available"}
      cardItems={cardItems}
      keywords={dataset.keywords
        ?.map((keyword) =>
          typeof keyword === "string"
            ? keyword
            : keyword.label || keyword.display_name
        )
        .filter((kw): kw is string => !!kw)}
      externalUrl={isExternal ? externalAccessUrl : undefined}
      button={buttonElement}
      isExternal={isExternal}
    />
  );
}

export default DatasetCard;