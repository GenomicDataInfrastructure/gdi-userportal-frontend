---
slug: /developer-guide/test-locally
sidebar_label: "Test harvester locally"
sidebar_position: 2
description: Set up local testing environment for DCAT harvesting
---

<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI

SPDX-License-Identifier: CC-BY-4.0
-->

# Test harvester locally

Test DCAT harvesting in CKAN by setting up a local nginx web server. This guide assumes you have CKAN running with the previously configured docker-compose.

## Use hosted test data

You can also test harvesting with the Health-RI harvesting test data repository.

1. Find the CKAN sysadmin credentials in the `.env` file:

   ```bash
   CKAN_SYSADMIN_NAME
   CKAN_SYSADMIN_PASSWORD
   ```

2. Log in to CKAN with those credentials.

3. Create an organisation. CKAN requires an organisation before you can create a harvest source. The name can be any local test name, for example `testorg1`.

4. Create a harvest source for the test data from [`Health-RI/harvesting-test-data`](https://github.com/Health-RI/harvesting-test-data):

   | Field                | Value                                                                                                                          |
   | -------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
   | **URL**              | `https://raw.githubusercontent.com/Health-RI/harvesting-test-data/c1019281532fb1114bd4eba362e94cc04ae18132/dataset_health.ttl` |
   | **Title**            | Any title you can recognise later, for example `harvest_dataset_health`                                                        |
   | **Source type**      | `Generic DCAT RDF Harvester`                                                                                                   |
   | **Update frequency** | `Manual`                                                                                                                       |
   | **Configuration**    | `{ "profile": "fairdatapoint_dcat_ap", "rdf_format": "text/turtle", "force_all": "true" }`                                     |

   The test data can change during development. Ask the team which version to use if you need reproducible results. The URL above pins an earlier commit.

5. Save the harvest source.

6. Trigger the harvest from the running `ckan-dev` container. Replace `harvest_dataset_health` with the title, name, or harvest source ID you used. If CKAN generated a different URL name, use the last part of the harvest source URL.

   ```bash
   docker compose exec -it ckan-dev bash
   ckan --config=/srv/app/ckan.ini harvester run-test harvest_dataset_health
   ```

   The test data contains non-resolvable URIs, so several `404` errors are expected. If you get `sqlalchemy.exc.PendingRollbackError`, rerun the harvest job and cancel the running job when prompted. This can happen because dataset and dataset series records are created in an order that is not deterministic.

## Set up nginx web server

Start an nginx container to serve your DCAT files. Replace `~/Development/xnatdcat/` with the folder containing your test data.

```bash
docker run -it -d -p 8888:80 --name rdf -v ~/Development/xnatdcat/:/usr/share/nginx/html nginx
```

Verify the server is running by opening [http://localhost:8888](http://localhost:8888) in your browser.

## Connect to CKAN network

Connect the nginx container to CKAN's Docker network so CKAN can access it:

```bash
docker network connect ckan-docker_default rdf
```

Now you can configure the harvest source in CKAN using the URL: `http://rdf:80/the_file.ttl`

## Configure MIME types

CKAN identifies DCAT files by their MIME types. Nginx does not include the correct MIME types for RDF formats by default.

Add the following configuration to `/etc/nginx/conf.d/default.conf` in the nginx container:

```nginx
types {
    text/turtle ttl;
    application/rdf+xml rdf;
}
```

Add this configuration inside the `server` block, above the `location` directive. Restart the container to apply the changes. CKAN can now harvest from your local web server.
