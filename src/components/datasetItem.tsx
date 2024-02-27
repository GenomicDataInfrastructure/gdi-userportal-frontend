import Chips from "./Chips";

type DatasetItemProps = {
  title: string;
  publicationDate: string;
  catalogue: string;
  description: string;
  themes: string[];
};

function DatasetItem({
  title,
  publicationDate,
  catalogue,
  description,
  themes,
}: DatasetItemProps) {
  return (
    <div className="rounded-lg border-[1px] bg-white-smoke p-8 duration-200 hover:border-[2px] hover:border-info hover:shadow-md hover:ring-offset-1">
      <div className="mb-4 flex justify-between">
        <h3 className="text-2xl text-info">{title}</h3>
        <p className="text-md text-gray-400">{publicationDate}</p>
      </div>
      <p className="mb-4 text-gray-400">{catalogue}</p>
      <p className="mb-4 text-sm">{description}</p>
      <Chips chips={themes} />
    </div>
  );
}

export default DatasetItem;
