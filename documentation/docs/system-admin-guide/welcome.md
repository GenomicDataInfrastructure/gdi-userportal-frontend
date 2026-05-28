---
slug: /welcome-system-admins
sidebar_label: "Welcome"
sidebar_position: 1
---

# Welcome to GDI system administration

This guide is for system administrators responsible for deploying, configuring, and maintaining the GDI User Portal platform and its associated services.

The GDI platform is part of the Genomic Data Infrastructure (GDI) project and the 1+ Million Genomes Initiative. It provides the technical infrastructure that enables federated and secure cross-border access to genomic datasets across European countries. 

As a system administrator, you can deploy and maintain the platform components—including the frontend, backend microservices, CKAN data catalogue, Keycloak authentication, and supporting services—that power Europe's largest network of genomic data for healthcare research and clinical purposes.

## What would you like to do?


import Link from '@docusaurus/Link';
import styles from '@site/src/pages/index.module.css';

<div className={styles.grid}>

  <div className={styles.card}>
    <Link to="/system-admin-guide/deploy-infrastructure">
      <h3>Deploy infrastructure</h3>
    </Link>
    <p>Set up the platform components and hosting environment.</p>
  </div>

  <div className={styles.card}>
    <Link to="/system-admin-guide/deploy-infrastructure">
      <h3>Install the platform</h3>
    </Link>
    <p>Install frontend, backend services, CKAN extensions, and supporting components.</p>
  </div>

  <div className={styles.card}>
    <Link to="/system-admin-guide/configure-auth">
      <h3>Set up authentication</h3>
    </Link>
    <p>Configure user access with Keycloak and LS-AAI integration.</p>
  </div>

  <div className={styles.card}>
    <Link to="/system-admin-guide/manage-user-roles">
      <h3>Manage roles and permissions</h3>
    </Link>
    <p>Control user access levels within the data catalogue system.</p>
  </div>

  <div className={styles.card}>
    <Link to="/system-admin-guide/manage-data-services">
      <h3>Manage data and services</h3>
    </Link>
    <p>Administer CKAN, configure harvesters, and set up FAIR Data Points.</p>
  </div>

  <div className={styles.card}>
    <Link to="/system-admin-guide/monitor-maintain">
      <h3>Monitor and maintain the system</h3>
    </Link>
    <p>Track performance, audit security, and manage platform updates.</p>
  </div>

</div>

