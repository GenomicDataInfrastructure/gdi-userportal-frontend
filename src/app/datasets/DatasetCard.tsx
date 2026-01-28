// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  SearchedDataset,
  ValueLabel,
} from "@/app/api/discovery/open-api/schemas";
// import { retrieveDatasetApi } from "@/app/api/discovery";
import { retrieveDatasetApi } from "@/app/api/discovery-v1/index";
import { useWindowSize } from "@/hooks";
import { useDatasetBasket } from "@/providers/DatasetBasketProvider";
import { truncateDescription } from "@/utils/textProcessing";
import {
  getFirstAccessUrl,
  getExternalDatasetInfo,
} from "@/utils/datasetHelpers";
import {
  faMinusCircle,
  faPlusCircle,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card, { CardItem } from "../../components/Card";
import { useEffect, useState, useRef, useMemo } from "react";
import { ExternalDatasetConfirmationDialog } from "@/components/ExternalDatasetCardLink";
import { createAddDatasetToBasketApi, removeDatasetFromBasketApi } from "../api/access-management-v1";

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
  const [distributions, setDistributions] = useState(dataset.distributions);
  const hasFetchedRef = useRef(false);
  useEffect(() => {
    setDistributions(dataset.distributions);
  }, [dataset.id, dataset.distributions]);
  const { isExternal, label: externalLabel } = useMemo(() => {
    const dataset_ = { id: dataset.id, conformsTo } as SearchedDataset;
    return getExternalDatasetInfo(dataset_);
  }, [dataset.id, conformsTo]);

  useEffect(() => {
    const isConformsToEmpty = !conformsTo?.length;
    const shouldFetch =
      dataset.id &&
      !hasFetchedRef.current &&
      (isConformsToEmpty ||
        (isExternal && !distributions?.some((d) => d.accessUrl)));

    if (shouldFetch) {
      hasFetchedRef.current = true;
      console.log("Fetching full dataset info for", dataset);
      retrieveDatasetApi(dataset.id)
        .then((fullDataset) => {
          setConformsTo(fullDataset?.conformsTo);
          setDistributions(fullDataset?.distributions);
        })
        .catch((error) => {
          console.error("Failed to retrieve dataset", error);
          hasFetchedRef.current = false;
        });
    }
  }, [dataset.id, isExternal, distributions]);

  const isInBasket = basket.some((ds) => ds.id === dataset.id);
  const externalAccessUrl = getFirstAccessUrl(distributions);

  const toggleDatasetInBasket = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Dataset" ,dataset);
    if (isInBasket) {
      removeDatasetFromBasket(dataset);
      removeDatasetFromBasketApi(dataset.id);
    } else {
      addDatasetToBasket(dataset);
      createAddDatasetToBasketApi({
        dataset_id: dataset.id,
        distribution_id: dataset.distributions?.[0]?.id ?? "",
      });
    }
  };

  const hasIdentifier = !!dataset.identifier;
  const buttonDisabled = isLoading || !hasIdentifier;

  const buttonElement = !displayBasketButton ? undefined : isExternal ? (
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
  ) : (
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

  const subTitles = useMemo(
    () =>
      dataset.themes
        ?.map((theme) => theme.label)
        .filter((title): title is string => !!title),
    [dataset.themes]
  );

  const keywords = useMemo(
    () =>
      dataset.keywords
        ?.map((keyword) =>
          typeof keyword === "string" ? keyword : keyword.label
        )
        .filter((kw): kw is string => !!kw),
    [dataset.keywords]
  );

  return (
    <Card
      url={`/datasets/${dataset.id}`}
      title={dataset.title}
      subTitles={subTitles}
      description={truncatedDesc || "No description available"}
      cardItems={cardItems}
      keywords={keywords}
      externalUrl={isExternal ? externalAccessUrl : undefined}
      button={buttonElement}
      isExternal={isExternal}
      externalLabel={externalLabel}
    />
  );
}

export default DatasetCard;
