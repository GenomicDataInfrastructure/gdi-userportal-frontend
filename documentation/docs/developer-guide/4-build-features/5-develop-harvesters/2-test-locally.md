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
