import Document, { Html, Head, Main, NextScript } from "next/document";
import getConfig from "next/config";

export default class CustomDocument extends Document {
  render() {
    const config = getConfig().publicRuntimeConfig;
    const analytics_src = config.ANALYTICS_SRC;
    const analytics_id = config.ANALYTICS_ID;

    return (
      <Html>
        <Head>
          {analytics_src && analytics_id && (
            <script
              async
              defer
              data-website-id={analytics_id}
              src={`${analytics_src}/umami.js`}
            />
          )}
        </Head>
        <body>
          <Main />
        </body>
        <NextScript />
      </Html>
    );
  }
}
