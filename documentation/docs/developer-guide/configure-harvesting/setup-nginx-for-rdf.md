---
title: Set up nginx for RDF
sidebar_position: 4
---

<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI

SPDX-License-Identifier: CC-BY-4.0
-->

# Set up nginx with correct MIME types for CKAN

Set up a simple nginx web server to test DCAT harvesting in CKAN with proper RDF MIME types.

## Prerequisites

- Docker installed
- CKAN running via docker-compose
- RDF files to expose for harvesting

## Step 1: Load nginx Container

Load an nginx container to use as a web server. Replace `~/Development/xnatdcat/` with the folder you want to expose:

```bash
docker run -it -d -p 8888:80 --name rdf -v ~/Development/xnatdcat/:/usr/share/nginx/html nginx
```

## Step 2: Verify nginx is Running

Check if [http://localhost:8888](http://localhost:8888) returns a valid web page.

## Step 3: Connect to CKAN Network

To ensure CKAN can access the web server, connect it to the same network:

```bash
docker network connect ckan-docker_default rdf
```

In CKAN, you can now set the harvest source as: `http://rdf:80/the_file.ttl`

## Step 4: Configure MIME Types

To harvest data sources, CKAN looks at MIME types. Unfortunately, nginx by default does not have the correct ones built-in.

### Add MIME Types to nginx Configuration

1. In Docker Desktop, go to the container
2. Navigate to files
3. Edit `/etc/nginx/conf.d/default.conf`
4. Add the following in the `server` block (e.g., above `location`):

```nginx
types {
  text/turtle ttl;
  application/rdf+xml rdf;
}
```

## Step 5: Restart the Container

Restart the nginx container for changes to take effect:

```bash
docker restart rdf
```

After restart, CKAN can harvest from this nginx server.

## Test the setup

1. Configure a harvest source in CKAN pointing to your nginx server
2. Run the harvester test:

```bash
ckan --config=/srv/app/ckan.ini harvester run-test <harvester-id>
```

3. Verify datasets are created in CKAN

## Supported RDF formats

The MIME types configuration supports:

- **text/turtle** (.ttl files): Turtle RDF format
- **application/rdf+xml** (.rdf files): RDF/XML format

## Troubleshooting

### nginx Not Serving Files

Verify the volume mount is correct and files exist:

```bash
docker exec -it rdf ls /usr/share/nginx/html
```

### CKAN Cannot Connect to nginx

Ensure both containers are on the same network:

```bash
docker network inspect ckan-docker_default
```

### Wrong MIME Type

Check nginx logs to see what MIME type is being served:

```bash
docker logs rdf
```

## Next steps

- [Harvest DCAT-AP](./harvest-dcat-ap.md) - Configure DCAT harvesting
- [Harvest FAIR Data Points](./harvest-fair-datapoints.md) - FDP harvesting
- [Harvester update strategy](./harvester-update-strategy.md) - Understand updates
