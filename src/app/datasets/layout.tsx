import PageContainer from "@/components/PageContainer";
import FilterList from "./FilterList";
import SearchBar from "@/components/Searchbar";
import DatasetsProvider from "@/providers/datasets/DatasetsProvider";
import DatasetCount from "./DatasetCount";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer>
      <div className="grid grid-cols-12">
        <div className="col-start-0 col-span-12 flex items-center justify-between xl:col-span-10 xl:col-start-2">
          <SearchBar />
        </div>
        <DatasetsProvider>
          <DatasetCount />
          <div className="col-start-0 col-span-12 flex flex-col gap-4 sm:block xl:hidden">
            <div className="my-4 h-fit">
              <FilterList />
            </div>
          </div>
          <div className="col-start-0 col-span-4 flex flex-col gap-y-6">
            <div className="col-start-0 col-span-4 mr-6 hidden h-fit xl:block px-6">
              <FilterList />
            </div>
          </div>
          {children}
        </DatasetsProvider>
      </div>
    </PageContainer>
  );
}
