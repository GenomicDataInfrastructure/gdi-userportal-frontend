import DatasetItem from "./datasetItem";

function DatasetList() {
  return (
    <div className="flex flex-col gap-y-12">
      <DatasetItem
        title="Healthcare Statistics"
        publicationDate="26/02/2024"
        catalogue="EU Health"
        description="Diagnosis data of patients and patients in hospitals. The hospital diagnosis statistics are part of the hospital statistics and have been collected annually from all hospitals since 1993. The statistics include information on the main diagnosis (coded according to ICD-10), length of stay, department and selected sociodemographic characteristics such as age, gender and place of residence, among others. Basic data of hospitals and preventive care or rehabilitation facilities. The basic data statistics are part of the hospital statistics. The material and personnel resources of hospitals and preventive or rehabilitation facilities and their specialist departments have been reported annually since 1990. The aggregated data are freely accessible."
        themes={["Health protection", "Prevention", "Nurses"]}
      />
      <DatasetItem
        title="Healthcare Statistics"
        publicationDate="26/02/2024"
        catalogue="EU Health"
        description="Diagnosis data of patients and patients in hospitals. The hospital diagnosis statistics are part of the hospital statistics and have been collected annually from all hospitals since 1993. The statistics include information on the main diagnosis (coded according to ICD-10), length of stay, department and selected sociodemographic characteristics such as age, gender and place of residence, among others. Basic data of hospitals and preventive care or rehabilitation facilities. The basic data statistics are part of the hospital statistics. The material and personnel resources of hospitals and preventive or rehabilitation facilities and their specialist departments have been reported annually since 1990. The aggregated data are freely accessible."
        themes={["Health protection", "Prevention", "Nurses"]}
      />
      <DatasetItem
        title="Healthcare Statistics"
        publicationDate="26/02/2024"
        catalogue="EU Health"
        description="Diagnosis data of patients and patients in hospitals. The hospital diagnosis statistics are part of the hospital statistics and have been collected annually from all hospitals since 1993. The statistics include information on the main diagnosis (coded according to ICD-10), length of stay, department and selected sociodemographic characteristics such as age, gender and place of residence, among others. Basic data of hospitals and preventive care or rehabilitation facilities. The basic data statistics are part of the hospital statistics. The material and personnel resources of hospitals and preventive or rehabilitation facilities and their specialist departments have been reported annually since 1990. The aggregated data are freely accessible."
        themes={["Health protection", "Prevention", "Nurses"]}
      />
    </div>
  );
}

export default DatasetList;
