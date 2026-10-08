// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0

import {
  SearchedDataset,
  ValueLabel,
  RetrievedDistribution,
} from "@/app/api/discovery/open-api/schemas";
import { retrieveDatasetApi } from "@/app/api/discovery";
import { useWindowSize } from "@/hooks";
import AddToBasketButton from "@/components/AddToBasketButton";
import { truncateDescription } from "@/utils/textProcessing";
import {
  getFirstAccessUrl,
  getExternalDatasetInfo,
} from "@/utils/datasetHelpers";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card, { CardItem } from "../../components/Card";
import { useEffect, useState, useRef, useMemo } from "react";
import { ExternalDatasetConfirmationDialog } from "@/components/ExternalDatasetCardLink";
import { useTranslations } from "next-intl";

type DatasetCardProps = {
  dataset: SearchedDataset;
  cardItems: CardItem[];
  displayBasketButton?: boolean;
  sourceLabel?: string;
};

function DatasetCard({
  dataset,
  cardItems,
  displayBasketButton = true,
  sourceLabel: sourceLabelProp,
}: Readonly<DatasetCardProps>) {
  const tDetail = useTranslations("datasets.detail");
  const screenSize = useWindowSize();
  const truncatedDesc = dataset.description
    ? truncateDescription(dataset.description, screenSize)
    : null;

  const [conformsTo, setConformsTo] = useState<ValueLabel[] | undefined>(
    dataset.conformsTo
  );
  const [distributions, setDistributions] = useState<RetrievedDistribution[]>(
    []
  );
  const hasFetchedRef = useRef(false);

  const { isExternal, label: externalLabel } = useMemo(() => {
    const dataset_ = { id: dataset.id, conformsTo } as SearchedDataset;
    return getExternalDatasetInfo(dataset_);
  }, [dataset.id, conformsTo]);

  useEffect(() => {
    const isConformsToEmpty = !conformsTo?.length;
    const shouldFetch =
      dataset.id &&
      !dataset.isSeries &&
      !hasFetchedRef.current &&
      (isConformsToEmpty ||
        (isExternal && !distributions?.some((d) => d.accessUrl)));

    if (shouldFetch) {
      hasFetchedRef.current = true;
      retrieveDatasetApi(dataset.id)
        .then((fullDataset) => {
          setConformsTo(fullDataset?.conformsTo);
          setDistributions(fullDataset?.distributions || []);
        })
        .catch((error) => {
          console.error("Failed to retrieve dataset", error);
          hasFetchedRef.current = false;
        });
    }
  }, [
    dataset.id,
    dataset.isSeries,
    isExternal,
    distributions,
    conformsTo?.length,
  ]);

  const externalAccessUrl = getFirstAccessUrl(distributions);

  const externalDatasetAction = (
    <div role="presentation" onClick={(e) => e.stopPropagation()}>
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
              <span>{tDetail("accessExternalDataset")}</span>
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
          <span>{tDetail("externalLinkNotAvailable")}</span>
          <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
        </button>
      )}
    </div>
  );

  const buttonElement =
    !displayBasketButton || dataset.isSeries ? undefined : (
      <AddToBasketButton
        dataset={dataset}
        withoutAccessContent={isExternal ? externalDatasetAction : undefined}
      />
    );

  const subTitles = useMemo(
    () =>
      dataset.themes
        ?.map((theme) => theme.label)
        .filter((title): title is string => !!title),
    [dataset.themes]
  );

  const keywords = useMemo(
    () => dataset.keywords?.filter((kw): kw is string => !!kw),
    [dataset.keywords]
  );
  const entityLabel = dataset.isSeries
    ? tDetail("datasetSeriesTag")
    : undefined;

  return (
    <Card
      url={`/datasets/${dataset.id}`}
      title={dataset.title}
      subTitles={subTitles}
      description={truncatedDesc || tDetail("noDescriptionAvailable")}
      cardItems={cardItems}
      keywords={keywords}
      externalUrl={isExternal ? externalAccessUrl : undefined}
      button={buttonElement}
      isExternal={isExternal}
      externalLabel={externalLabel}
      entityLabel={entityLabel}
      sourceLabel={sourceLabelProp}
    />
  );
}

export default DatasetCard;
