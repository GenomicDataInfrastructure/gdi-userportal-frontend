<!--
SPDX-FileCopyrightText: 2024 Stichting Health-RI
SPDX-FileContributor: PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

[![REUSE status](https://api.reuse.software/badge/github.com/GenomicDataInfrastructure/gdi-userportal-frontend)](https://api.reuse.software/info/github.com/GenomicDataInfrastructure/gdi-userportal-frontend)
![example workflow](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/actions/workflows/main.yml/badge.svg)
![example workflow](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/actions/workflows/test.yml/badge.svg)
![example workflow](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/actions/workflows/release.yml/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=GenomicDataInfrastructure_gdi-userportal-frontend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=GenomicDataInfrastructure_gdi-userportal-frontend)
[![GitHub contributors](https://img.shields.io/github/contributors/GenomicDataInfrastructure/gdi-userportal-frontend)](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/graphs/contributors)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)

<div style="display: flex; justify-content: center; padding: 20px;">
  <img src="src/assets/egdi-logo-horizontal-full-color-rgb.svg" alt="European Genomic Data Infrastructure Logo" width="300">
</div>

<div style="display: flex; justify-content: center; padding: 20px;">
  <img src="src/assets/demo_gdi_front_end.gif" alt="Genomic Data Infrastructure GIF" width="1000">
</div>

# GDI User Portal Front-end

The GDI User Portal Front-end is a crucial component of the Genomic Data Infrastructure (GDI) project, which aims to facilitate access to genomic, phenotypic, and clinical data across Europe. The GDI project is committed to establishing a federated, sustainable, and secure infrastructure to enable seamless data access. Leveraging the outcomes of the Beyond 1 Million Genomes (B1MG) project, the GDI project is actively realizing the ambitious goals set forth by the 1+Million Genomes (1+MG) initiative.

The GDI User Portal Front-end serves as the user-friendly interface for this initiative, utilizing [Angular CLI](https://github.com/angular/angular-cli) version 16.2.3. This frontend application plays a crucial role in enhancing user experience and ensuring efficient interaction with the genomic data infrastructure.

- **Status**: 1.0.0
- **Demo Link**: [Demo Website](https://catalogue-test.azurewebsites.net/)
- **Related Project**: [1+ Million Genomes Project](https://gdi.onemilliongenomes.eu/)

## Installation

### Locally

Before using the GDI User Portal Front-end, make sure you have the required dependencies installed. Follow the installation instructions below:

`npm install`

You also have to create a new `env.local` file in the root directory, and copy the content of `.env.local.example` into the new file. Feel free to modify the environment variables as you wish.

### Using Docker

Alternatively, you can run the docker-compose file that provides a running instance of the application. Use the following command to run docker-compose:

`docker compose up` or `docker-compose up` depending on your docker compose version.

## Development server

Run `npm run dev` for a dev server. Navigate to `http://localhost:3000/`. The application will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `.next/` directory.

## Running unit tests

TODO

## Running end-to-end tests

TODO

## Disclaimer

Please note that this version of GDI User Portal is the result of deliverable "MS11 - Development of the user portal deployed", which is still undergoing further feature developments and testing before its release in production. Therefore, you may witness some instabilities and broken links. Should you have any feedback, please let us know so we can take into account for the future releases accordingly. Your help in this regard is greatly appreciated!

## Further help

To get more help on Next JS, go check out the [Next JS API Reference](https://nextjs.org/docs/pages/api-reference) page.

## License

- All original source code is licensed under [Apache-2.0](./LICENSES/Apache-2.0.txt).
- All documentation is licensed under [CC-BY-4.0](./LICENSES/CC-BY-4.0.txt).
- All the fonts are licensed under [OFL-1.1](./LICENSES/OFL-1.1.txt).
- Some configuration and data files are licensed under [CC-BY-4.0](./LICENSES/CC-BY-4.0.txt).
- For more accurate information, check the individual files.
