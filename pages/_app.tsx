import "@portaljs/components/styles.css";
import "../styles/globals.scss";
import "../styles/tabs.scss";

// import "../styles/flowershow/docsearch.scss";
// import "../styles/flowershow/global.scss";
// import "../styles/flowershow/prism.scss";

import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import Script from "next/script";
import getConfig from "next/config";

import SEO from "../next-seo.config";

import { siteConfig } from "../config/siteConfig";
// import { pageview } from "@flowershow/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ThemeProvider } from "next-themes";

import Loader from "../components/_shared/Loader";

type CustomElement = { children: any; className?: any };
declare global {
  interface Window {
    google: any;
    ScrollTimeline: any;
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      ["snap-tabs"]: CustomElement;
    }
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const config = getConfig();
  const publicRuntimeConfig = config.publicRuntimeConfig;

  useEffect(() => {
    if (siteConfig.analytics) {
      const handleRouteChange = (url) => {
        // pageview(url);
      };
      router.events.on("routeChangeComplete", handleRouteChange);
      return () => {
        router.events.off("routeChangeComplete", handleRouteChange);
      };
    }
  }, [router.events]);

  return (
    <>
      <ThemeProvider
        disableTransitionOnChange
        attribute="class"
        defaultTheme={siteConfig.theme.default}
        forcedTheme={siteConfig.theme.default ? null : "light"}
      >
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        {publicRuntimeConfig.ANALYTICS_GA_ID && (
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${publicRuntimeConfig.ANALYTICS_GA_ID}`}
          />
        )}
        {publicRuntimeConfig.ANALYTICS_GA_ID && (
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${publicRuntimeConfig.ANALYTICS_GA_ID}', {
                page_path: window.location.pathname,
              });
            `,
            }}
          />
        )}
        <DefaultSeo {...SEO} />
        <Loader />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
