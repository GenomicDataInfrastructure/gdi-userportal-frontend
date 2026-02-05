import React, { useEffect } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";

export default function Home() {
  useEffect(() => {
    // Add data attribute to body for CSS targeting
    document.body.setAttribute("data-route", "/");

    return () => {
      document.body.removeAttribute("data-route");
    };
  }, []);

  return (
    <Layout
      title="GDI Portal Documentation"
      description="Documentation for the GDI User Portal platform"
    >
      <header className={styles.heroBanner}>
        <div className="container">
          <h1 className="hero__title">GDI Portal Documentation</h1>
          <p className="hero__subtitle">
            Everything you need to work with the Genomic Data Infrastructure
            Portal
          </p>
        </div>
      </header>
      <main className={styles.mainPaddingBottom}>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              <div className="col col--3">
                <div className={styles.homeCard}>
                  {<img
                    src="img/im-a-user-people-1.svg"
                    alt="User icon"
                    style={{ width: 100, height: 100, marginBottom: 12 }}
                  />}
                  <h3>
                    <Link to="/welcome-data-users">Data users</Link>
                  </h3>
                  <p className={styles.homeSubtext}>
                    I'm a researcher, data professional, or{" "}
                    <strong>front-office staff</strong> requesting access to
                    genomic data.
                  </p>
                </div>
              </div>

              <div className="col col--3">
                <div className={styles.homeCard}>
                  {<img
                    src="img/im-a-catalogue-manager-1.svg"
                    alt="System Admin icon"
                    style={{ width: 100, height: 100, marginBottom: 12 }}
                  />}
                  <h3>
                    <Link to="/catalogue-managers-guide/welcome">
                      Catalogue managers
                    </Link>
                  </h3>
                  <p className={styles.homeSubtext}>
                    I'm a catalogue manager, admin, or{" "}
                    <strong>back-office staff</strong> who manages my
                    organisation's genomic data catalogue.
                  </p>
                </div>
              </div>

              <div className="col col--3">
                <div className={styles.homeCard}>
                  {<img
                    src="img/im-a-dev-1.svg"
                    alt="User icon"
                    style={{ width: 100, height: 100, marginBottom: 12 }}
                  />}
                  <h3>
                    <Link to="/welcome-developers">Developers</Link>
                  </h3>
                  <p className={styles.homeSubtext}>
                    I'm a developer or <strong>engineering team</strong> member
                    contributing to the update and maintenance of the GDI User
                    Portal.
                  </p>
                </div>
              </div>

              <div className="col col--3">
                <div className={styles.homeCard}>
                  {<img
                    src="img/im-a-sys-admin-1.svg"
                    alt="System Admin icon"
                    style={{ width: 110, height: 110, marginBottom: 2 }}
                  />}
                  <h3>
                    <Link to="/welcome-system-admins">System admins</Link>
                  </h3>
                  <p className={styles.homeSubtext}>
                    I'm a system admin or <strong>operations staff</strong>{" "}
                    deploying and managing the GDI User Portal infrastructure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
