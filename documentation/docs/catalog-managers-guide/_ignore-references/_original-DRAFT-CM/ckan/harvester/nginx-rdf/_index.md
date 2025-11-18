---
title: Setting up nginx with correct MIME types with CKAN
---

<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI

SPDX-License-Identifier: CC-BY-4.0
-->

To test harvesting of DCAT in CKAN, it’s easiest to set up a simple web server. If CKAN is run using the previously set-up docker-compose, it can be done with a few commands.

First load an nginx container to use as webserver. Replace `~/Development/xnatdcat/` by the folder you want to expose.

`docker run -it -d -p 8888:80 --name rdf -v ~/Development/xnatdcat/:/usr/share/nginx/html nginx`

Then check if [http://localhost:8888](http://localhost:8888) returns a valid web page.

To make sure CKAN can access it too, connect the webserver to the same network:

`docker network connect ckan-docker_default rdf`

In ckan, as harvest source you can then set http://rdf:80/the_file.ttl

To harvest data sources, CKAN looks at MIME types. Unfortunately nginx by default does not have the correct ones built-in. In Docker Desktop, go to the container, files, and add the following to /etc/nginx/conf.d/default.conf

```java
   types {
      text/turtle ttl;
      application/rdf+xml rdf;
    }
```

Can add it in the `server` block e.g. above `location`. Restart the container and then CKAN can harvest from this.