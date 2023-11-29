import type { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import BlogSection from "../components/home/blogSection/BlogSection";
import Hero from "../components/home/heroSection/Hero";
import { StatsProps } from "../components/home/heroSection/Stats";
import MainSection from "../components/home/mainSection/MainSection";
import Layout from "../components/_shared/Layout";
import { CKAN } from "@portaljs/ckan"
import getConfig from "next/config";

export async function getStaticProps() {
  const Ckan = new CKAN(getConfig().publicRuntimeConfig.DMS)
  const datasets = await Ckan.packageSearch({
    offset: 0,
    limit: 5,
    tags: [],
    groups: [],
    orgs: [],
  });
  const groups = await Ckan.getGroupsWithDetails();
  const orgs = await Ckan.getOrgsWithDetails();
  const stats: StatsProps = {
    datasetCount: datasets.count,
    groupCount: groups.length,
    orgCount: orgs.length,
  };
  return {
    props: {
      datasets: datasets.datasets,
      groups,
      orgs,
      stats,
    },
  };
}

export default function Home({
  datasets,
  groups,
  orgs,
  stats,
}: InferGetServerSidePropsType<typeof getStaticProps>): JSX.Element {
  return (
    <>
      <Head>
        <title>Open Data Portal Demo</title>
        <meta name="description" content="Open Data Portal Demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Hero stats={stats} />
        <MainSection groups={groups} datasets={datasets} />
        <BlogSection />
      </Layout>
    </>
  );
}
