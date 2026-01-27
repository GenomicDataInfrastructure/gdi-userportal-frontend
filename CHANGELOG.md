<!--
SPDX-FileCopyrightText: 2025 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.3.9] - 2025-04-04
## [v1.6.0] - 2026-01-26

### Added
- feat: Enhance DatasetMetadata component with tooltips and compatibility checks by @nolliia in b5914e3
- feat: add Healthdcat-ap fields in dataset details page (#761) by @Kacem Bechka in 606ec35
- feat: remove population.dataset and use datasetId by @Rania Hamdani in 4ac9752
- feat: Add Genome of Europe filters and allele frequency search by @Rania Hamdani in 5398362
- feat: adress sourery comments by @Rania Hamdani in 5205986
- feat: add license for added logos by @Rania Hamdani in bfeca97
- feat: add effects for cards to match 1+mg website by @Rania Hamdani in b63c586
- feat: change UI colors, fonts, css to natch 1+MG by @Rania Hamdani in dfce42f
- feat: change color palette, logo and background by @Rania Hamdani in b1f6817
- feat: enhance conforms to label code by @Rania Hamdani in c41c835
- feat: enhance code quality by @Rania Hamdani in 265b636
- feat: the users have an option in the dataset search page to be redirected to the access url of the dataset by @Rania Hamdani in 93c3b9b
- feat: return conformsto value from dataset details API by @Rania Hamdani in 7108c48
- feat: check external dataset in dataset search page by @Rania Hamdani in 908910b
- feat: remove add to basket button for external datasets by @Rania Hamdani in d50d3a1
- feat: add logic and UI for external datasets by @Rania Hamdani in 9cb8be0


### Changed
- Update/packagelock (#775) by @Kacem Bechka in 49ac12e
- update packa-lock.json (#774) by @Kacem Bechka in 6f5bfcf
- chore(deps): update base image in Dockerfile to nodejs-24-minimal version 9.7-1769057030 (#771) by @Kacem Bechka in 391279b
- chore(deps): update actions/setup-node action to v6.2.0 (#767) by @LNDS-Sysadmins in cd80f33
- [Snyk] Upgrade @opentelemetry/auto-instrumentations-node from 0.67.2 to 0.67.3 (#757) by @RaniaHamdani2 in 3bfeb0b
- chore(deps): bump lodash from 4.17.21 to 4.17.23 (#770) by @dependabot[bot] in 8d3c639
- chore(deps): update actions/checkout action to v6.0.2 by @Renovate Bot in d38aa39
- ART-21977: Fix lint and type-check errors by @Inderpal Singh in 92ba2b3
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-24-minimal docker tag to v9.7-1767673702 by @Renovate Bot in 1d224d2
- chore(deps): update dependency eslint-config-next to v16.1.1 by @Renovate Bot in 228c355
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-24-minimal docker tag to v9.7-1766364136 by @Renovate Bot in 832c8be
- Update src/app/datasets/DatasetCard.tsx by @RaniaHamdani2 in 540c293
- chore(deps): update dependency eslint-config-next to v16.1.0 by @Renovate Bot in f2132ff
- ART-20575: Update legal terms and conditions document by @Rania Hamdani in e381e08
- refactor: dataset helpers by @Rania Hamdani in deaa2a0
- chore: revert frontend files exclusion from sonarqube analysis by @Rania Hamdani in c2df842
- chore: exclude proxy.ts from sonarqube analysis by @Rania Hamdani in db12b6b
- chore: exclude datasetHelpers from sonarqube analysis by @Rania Hamdani in 26c5563
- chore: exclude mock data files from sonarqube analysis by @Rania Hamdani in 98b8d65
- chore(deps): upgrade nodejs by @Bruno Pacheco in e8d5495
- chore(deps): update actions/checkout action to v6 by @Renovate Bot in d312568
- chore(deps): update actions/checkout action to v5.0.1 by @Renovate Bot in b97ac77
- chore: update sonar exclusions by @Bruno Pacheco in 616bc5a
- refactor: consolidate external dataset dialog logic into shared component by @Rania Hamdani in 3efc447
- chore: ignore local proxy API routes by @Rania Hamdani in 8cc9460
- Update documentation/docs/system-admin-guide/fdp/fair-data-point.md by @Bruno Pacheco in 29559be
- Update documentation/docs/system-admin-guide/publishing-new-version/release-process.md by @Bruno Pacheco in e371cd5
- Update documentation/docs/system-admin-guide/installation/azure.md by @Bruno Pacheco in b0924c1
- chore: add license files by @Bruno Pacheco in babd43d
- chore(deps): migrate to next lint to eslint by @Bruno Pacheco in c1cb726
- chore(deps): upgrade remaining packages by @Bruno Pacheco in 7930afa
- doc: run prettier by @Bruno Pacheco in 185d416
- chore(deps): upgrade next by @Bruno Pacheco in 4fc767b
- chore: run prettier in all files by @Bruno Pacheco in 54afac4
- chore(deps): update actions/upload-artifact action to v6 by @Renovate Bot in 8b9ea07
- chore(deps): update sonarsource/sonarqube-scan-action action to v7 by @Renovate Bot in 25a9ef8
- chore(deps): update fsfe/reuse-action action to v6 by @Renovate Bot in 072dc4c
- chore(deps): update actions/checkout action to v6 by @Renovate Bot in 5317943
- chore(deps): update actions/cache action to v5 by @Renovate Bot in 8cd94d2
- chore(deps): update docker/metadata-action action to v5.10.0 by @Renovate Bot in 518077c
- chore(deps): update actions/setup-node action to v6.1.0 by @Renovate Bot in 8ac531d
- chore(deps): bump next from 15.5.8 to 15.5.9 by @dependabot[bot] in 3ea0918
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.7-1764822684 by @Renovate Bot in 645571b
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.7-1764607007 by @Renovate Bot in 794d753
- doc: update CHANGELOG.md for v1.5.0 by @LNDS-Sysadmins in 561b42b
- initial content for CM, Developers, and Sys Admins by @Rhocela Pasigna in ea21bc1


### Fixed
- chore(deps): update devdependencies (patch) (#773) by @Kacem Bechka in 82a517c
- fix: exclude dependabot from SonarQube scan in CI workflow (#772) by @Kacem Bechka in e3496ad
- fix: upgrade react-dom from 19.2.0 to 19.2.1 (#751) by @RaniaHamdani2 in 4216bda
- fix: upgrade react from 19.2.0 to 19.2.1 (#750) by @RaniaHamdani2 in ffaaf47
- fix(deps): update dependency next to v16.1.4 by @Renovate Bot in ba81697
- fix some fields shouldn't show when they are empty by @nolliia in ce3fca3
- fix: disable handle click dataset when datasetId is not available by @Rania Hamdani in 837eedc
- fix: generalize not available column + window open instead of router open for dataset details pag by @Rania Hamdani in b302a3d
- fix: Keep conformsTo behaviour as it was and add request data access label back by @Rania Hamdani in 179e804
- fix: adress sourcery comments by @Rania Hamdani in 2a5b822
- fix: params to respect beacon API by @Rania Hamdani in 7132e6f
- fix: add to basket missing dataset params by @Rania Hamdani in d25d009
- fix: sourcery comments by @Rania Hamdani in 212c0ae
- fix: remove uri and replace conforms to label by @Rania Hamdani in 7f3a40c
- fix: Only include optional filters if they are not All by @Rania Hamdani in 82c64d7
- fix: fix unit tests to have the required params by @Rania Hamdani in 2f1d1ec
- fix: getExternalDatasetInfo called twice by @Rania Hamdani in ec3edb1
- fix: distribution url in search page by @Rania Hamdani in 694750a
- fix(deps): update dependency next to v16.1.1 by @Renovate Bot in f183425
- fix: reduce card renders by @Rania Hamdani in 902672c
- fix: npm check filter out invalid values by @Rania Hamdani in 956f5f5
- fix: conforms to not available message by @Rania Hamdani in b781c4f
- fix: legal links by @Rania Hamdani in 57cc42a
- fix(deps): update dependency next to v16.1.0 by @Renovate Bot in 3246d4d
- fix; comment playwright by @Rania Hamdani in 9583e8d
- fix: update sonar properties by @Rania Hamdani in 5fa0db6
- fix: remove getcomformsto label by @Rania Hamdani in dd7dea4
- fix: typecheck by @Rania Hamdani in e86be09
- fix: remove mock data by @Rania Hamdani in f4f968a
- refactor: fix issues reported by sonar in index file by @Rania Hamdani in cc8c1e5
- fix: enhance code quality by @Rania Hamdani in dfc8d5a
- chore: fix ORT configuration by @Bruno Pacheco in e02376f
- chore(deps): fix vulnerabilities by @Bruno Pacheco in 181fb55
- fix(deps): update dependency next to v15.5.8 [security] by @Renovate Bot in 389f9f0
- fix: upgrade React to 19.1.2+ to patch CVE-2025-55182 (#728) by @Inderpal Singh in 2a82e88
- fix(deps): update dependency next to v15.5.7 [security] by @Renovate Bot in 1fd91c7


### Removed
- Refactor datasetHelpers to remove logs and simplify code by @RaniaHamdani2 in 8e35d7d



## [v1.5.0] - 2025-11-28

### Changed

- doc: replace bullet by header in contributions by @Bruno Pacheco in 91e7b09
- doc: update CHANGELOG.md for v1.4.0 by @LNDS-Sysadmins in afb40eb

## [v1.4.0] - 2025-11-28

### Added

- feat: add DATETIME and NUMBER filter components (#712) by @Inderpal Singh in f486164
- feat: add footer feature flag (#669) by @RaniaHamdani2 in bb8e0bd

### Changed

- doc: rearrange contributing organizations section by @Bruno Pacheco in 3a8e4bf
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.7-1763382208 by @Renovate Bot in f7515d0
- chore(deps): update actions/checkout action to v5.0.1 by @Renovate Bot in 2594bcb
- chore: temporarily disable ORT job due to memory issues (#707) by @Inderpal Singh in b08e0db
- docs: ART-20515 Add CM guides for get started, dataset management, group management by @Rhocela Pasigna in 7bce243
- moved to-ignore files by @Rhocela Pasigna in bae6ea0
- add dataset by @Rhocela Pasigna in f90b70f
- what is a dataset by @Rhocela Pasigna in 90b3252
- add structure by @Rhocela Pasigna in e230bfe
- refine structure by @Rhocela Pasigna in 10f5456
- add original content and create files and folder structures by @Rhocela Pasigna in 5bd3ae3
- ad welcome CM and about GDI by @Rhocela Pasigna in cfe44ea
- chore(deps): update dependency brace-expansion to v4 by @Renovate Bot in 221ea42
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.7-1762215467 by @Renovate Bot in 90bfb65
- chore(deps): update actions/upload-pages-artifact action to v4 by @Renovate Bot in 8b09c1b
- chore(deps): update actions/upload-artifact action to v5 by @Renovate Bot in e86d18b
- chore(deps): update actions/checkout action to v5 by @Renovate Bot in 615be50
- chore(deps): update docker/metadata-action action to v5.9.0 by @Renovate Bot in 569cab0
- chore(deps): update docker/login-action action to v3.6.0 by @Renovate Bot in d2e03d7
- chore(deps): update aquasecurity/trivy-action action to v0.33.1 by @Renovate Bot in b818692
- chore(deps): update fsfe/reuse-action action to v6 by @Renovate Bot in 44d3f3d
- chore(deps): update docker/build-push-action action to v6.18.0 by @Renovate Bot in 34ec8eb
- chore(deps): update devdependencies by @Renovate Bot in b98762d
- chore(deps): update actions/checkout action to v4.3.0 by @Renovate Bot in 587c126
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.6-1760544659 by @Renovate Bot in 10503e0
- Fix/upgrade axios (#673) by @RaniaHamdani2 in 130f31c
- chore: temporarily disable SonarQube scan to unblock CI/CD by @Rania Hamdani in 1745394
- chore(deps): update actions/setup-node action to v6 by @Renovate Bot in 44aca4c
- docs: ART-20006 Guides for application results by @Rhocela Pasigna in b8e8b09
- doc: update about.md by @Bruno Pacheco in e10cf2f
- chore(deps): update azure/webapps-deploy action to v3.0.6 by @Renovate Bot in 3e023fc
- chore(deps): update actions/checkout action to v4.2.2 by @Renovate Bot in e8a34f8
- docs: ART-20012 Add export metadata guide and gitignored autogen search files by @Rhocela Pasigna in 001f443
- chore(deps): update fsfe/reuse-action digest to bb774aa by @Renovate Bot in 5480496
- chore(deps): update aquasecurity/trivy-action digest to dc5a429 by @Renovate Bot in 5f77e56
- chore: update the vulnerable sonarcloud version (#640) by @sehaartuc in 1b789e9
- docs: ART-11771 write the docs - user portal by @Rhocela Pasigna in f29e42e
- Fix GitHub Pages deployment and update repository configuration by @Rhocela Pasigna in 773c3dd
- docs: ART-19782 deploy docs to GitHub Pages by @Rhocela Pasigna in a049ae9
- doc: update copyright text in about.md.license by @Bruno Pacheco in b957643
- docs: ART-14672 licenses review by @Rania Hamdani in 5c221db
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.6-1760544659 by @Renovate Bot in 6b10ea8
- chore(deps): bump http-proxy-middleware in /documentation by @dependabot[bot] in 2fd5cfb
- style: ♯14672 formatting by @Rania Hamdani in 52b562b
- docs: set up doc app and initial user guide content by @Rhocela Pasigna in a84f5e3
- docs: ART-14672 add organizations to NOTICE.md, about.md, and source headers by @Rania Hamdani in 1ba6d09
- chore(deps): bump SonarSource/sonarqube-scan-action by @dependabot[bot] in 3a0f950
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.6-1754870984 by @Renovate Bot in ab7f46f
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.6-1754479264 by @Renovate Bot in 7c66d69
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.6-1754381159 by @Renovate Bot in 82cc796
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.6-1754272205 by @Renovate Bot in 1d20939
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.6-1753796458 by @Renovate Bot in 4e16628
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.6-1752501970 by @Renovate Bot in 5c49080
- doc: update CHANGELOG.md for v1.3.10 by @LNDS-Sysadmins in b37eb10

### Fixed

- fix: temporarily disable ORT in release workflow (#716) by @Inderpal Singh in e8de6b4
- fix: upgrade node-forge to 1.3.2 to fix CVE-2025-12816 (#713) by @Inderpal Singh in 63fea26
- fix: increase ORT Java heap memory to 6GB (#706) by @Inderpal Singh in 318f8aa
- fix: update OpenAPI schemas for CKAN data type compatibility (#705) by @Inderpal Singh in e183086
- fix: add DATETIME and NUMBER to FilterType enum (#701) by @Inderpal Singh in b0e8f00
- fixed typos by @Rhocela Pasigna in c8e19ef
- fix(deps): update opentelemetry-js monorepo by @Renovate Bot in 95372b7
- fix: pin aquasecurity/trivy-action to full commit SHA by @Rania Hamdani in 6999048
- fix: Updated next from 15.3.5 to ^15.5.6 by @Rania Hamdani in 1bb1490
- fix(deps): update font awesome by @Renovate Bot in 0756907
- fix(deps): update opentelemetry-js monorepo by @Renovate Bot in 97606dc
- fix(deps): update dependency @opentelemetry/auto-instrumentations-node to ^0.67.0 by @Renovate Bot in 623d9b7
- fix: pin fsfe/reuse-action to full commit SHA by @Rania Hamdani in c0154d6
- fix: upgrade Next.js from 15.3.5 to 15.5.6 by @Rania Hamdani in fcbd9ae
- fix: upgrade Next.js from 15.3.5 to 15.4.7 to fix next-runtime-env vulnerabilities by @Rania Hamdani in c43034a
- fix: upgrade playwright to 1.56.1 by @Rania Hamdani in 8ede5a8
- fix: upgrade axios to 1.13.2 by @Rania Hamdani in da3d1cb
- fix: sonar config by @Rania Hamdani in 5a38cd8
- fix: package.json & package-lock.json to reduce vulnerabilities by @snyk-bot in ee6ddd6
- docs(fix): ART-11771 Fix links and recreate missing pages by @Rhocela Pasigna in 2e9e973
- fix: documentation publication workflow (#660) by @Inderpal Singh in e00b484
- docs: ART-19782 Update docusaurus to fix gh GH page deployment (#658) by @Rose Pasigna in 5965eb6
- fix typo by @Rania Hamdani in b262859
- Restore problematic files from main branch to fix Sonar issues by @Rania Hamdani in ad7ef4e
- docs: ♯14672 fix format and license date by @Rania Hamdani in 91cfe85
- fix: ♯14672 address sourcery comments by @Rania Hamdani in 80c2660

### Removed

- removed duplicate reference file by @Rhocela Pasigna in 74486d8

### Security

- Fix/snyk vulnerabilities (#680) by @RaniaHamdani2 in 2a8727a
- Fix/snyk vulnerabilities (#677) by @RaniaHamdani2 in 2b4aaa8

## [v1.3.10] - 2025-07-08

### Added

- feat(ART-13843): update sonar config by @jadzlnds in 5e16ad1
- feat(ART-13843): update test env by @jadzlnds in 47ee4ba
- feat(ART-13843): update test env by @jadzlnds in 21b60f4
- feat(ART-13843): exclude e2e tests from unit tests by @jadzlnds in 9f5d1bd
- feat(ART-13843): exclude e2e tests from unit tests by @jadzlnds in a777774
- feat(ART-13843): add E2E by @jadzlnds in e4734e8
- feat(ART-13843): add E2E by @jadzlnds in 4dce601
- feat(ART-12204): update changelog by @jadzlnds in b613e10
- feat(ART-12204): update changelog by @jadzlnds in 14cd46d
- feat(ART-12204): update changelog by @jadzlnds in c90dfcc
- feat(ART-12204): update changelog by @jadzlnds in cc430e5
- feat(ART-12204): make changelog is updated when running release by splitting runners by @jadzlnds in 484eb92
- feat(ART-12204): make changelog is updated when running release by splitting runners by @jadzlnds in 9884fa8
- feat(ART-12204): update changelog by @jadzlnds in 091ef11

### Changed

- chore(deps): update aquasecurity/trivy-action action to v0.32.0 by @Renovate Bot in cfa701d
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.6-1751380832 by @Renovate Bot in 6306de2
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.5-1746535384 by @Renovate Bot in 855c715
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.5-1746006420 by @Renovate Bot in fcf867b
- add opentelemtry resources to be able to upgrade to the newest version by @zia alborzi in a8a1996
- opentelemetry type check by @zia alborzi in 2fbe3b0
- update package-lock.json by @zia alborzi in bfb5b42
- update package-lock.json by @zia alborzi in 1d9aad3
- revert changes by @zia alborzi in dd4c77a

### Fixed

- fix(deps): update dependency next to v15.3.5 by @Renovate Bot in 3266475
- fix(deps): update dependency @opentelemetry/resources to v2.0.1 by @Renovate Bot in 2bfa016
- fix(deps): update dependency @opentelemetry/auto-instrumentations-node to ^0.58.0 by @Renovate Bot in 42b3873
- minimal fix by @zia alborzi in f084061
- fix opentelemetry upgrade by @zia alborzi in cb276df
- fix(deps): update opentelemetry-js monorepo to ^0.200.0 by @Renovate Bot in 5f5185f
- fix fail by @zia alborzi in 98c077f
- check fix by @zia alborzi in dc213e1
- fix by @zia alborzi in bdc19bf
- fix(deps): update dependency next to v15.2.5 by @Renovate Bot in cd36e15

### Added

- feat(ART-12204): update changelog (#597) by @jadzlnds in 50317fc
- feat: add example value by @Younès Adem in fc9ed8d
- feat(ART-12204): update changelog by @jadzlnds in 5aea39c
- feat: add tooltip for variant value example by @Younès Adem in d632975
- feat: allele frequency behind feature flag by @Younès Adem in a663ec0
- feat: improve allele frequency ui by @Younès Adem in 5845d24
- feat: change navbar for allele frequency by @Younès Adem in 01debd8
- feat(ART-12204): fix conflict by @jadzlnds in 8dde9ca
- feat(ART-12204): update trivy by @jadzlnds in db84ebd
- feat(ART-12204): update trivy by @jadzlnds in 59164eb
- feat(ART-12204): update changelog.sh by @jadzlnds in d255e47
- feat(ART-12204): update changelog.sh by @jadzlnds in a9f0a5f
- feat(ART-12204): update release add changelog.sh by @jadzlnds in 1ade413
- feat: #13681 add feature flag for add participants by @Emiliana in 573c17f
- feat(ART-12204): add release trigger by @jadzlnds in 0dda796
- feat(ART-12142): invite member form by @Antoine Dorard in 2d9f78d

### Changed

- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.5-1742929466 by @Renovate Bot in 274cb55
- 📜 Update CHANGELOG.md for 1.3.3 by @jadzlnds in 1c94283
- chore: bump tailwind up to v4 by @Bruno Pacheco in b7b05f1
- chore(deps): update aquasecurity/trivy-action action to v0.30.0 by @Renovate Bot in 5491ed1
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.5-1741873206 by @Renovate Bot in 37d4062
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.5-1741243183 by @Renovate Bot in 882edd1
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.5-1741091630 by @Renovate Bot in 63e46b6
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.5-1740651938 by @Renovate Bot in 4ae7491
- chore(deps): update sonarsource/sonarqube-scan-action action to v5 by @Renovate Bot in 66798ec
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.5-1740411730 by @Renovate Bot in 13d8001
- refactor(ART-12142): remove unecessary console.log by @Antoine Dorard in 1c48711
- test(ART-12142): add extra tests by @Antoine Dorard in 61c3d71
- refactor(ART-12142): remove unecessary import by @Antoine Dorard in 06d0f70
- refactor(ART-12142): remove unecessary console.log's by @Antoine Dorard in d7afc3f
- chore(ART-10056): polishing by @jadz94 in 7434ae6
- chore(ART-10056): polishing by @jadz94 in 0617117
- chore(ART-10056): update error handling by @jadz94 in c411238
- chore(ART-10056): polish by @jadz94 in b6986af
- chore(ART-10056): use meaningful names by @jadz94 in b3b8588
- chore(ART-10056): license by @jadz94 in e466501
- chore(ART-10056): refactor by @jadz94 in 5481e95
- chore(ART-10056): refactor by @jadz94 in e4aeb66
- fear(ART-10056): add gvariants page by @jadz94 in 2ed4a57
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.5-1739448964 by @Renovate Bot in dddecd8
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.5-1739407042 by @Renovate Bot in 338a09e

### Fixed

- ignore cache in prettier to fix the pipeline by @zia alborzi in 6770982
- fix(deps): update dependency next to v15.2.4 by @Renovate Bot in 9c094d8
- fix(deps): update dependency react-markdown to v10 by @Renovate Bot in ee0aef1
- fix(deps): update dependency next to v15.2.3 by @Renovate Bot in 0040465
- chore(ART-10056): polish and fix bug by @jadz94 in 59a41a9
- chore(ART-10056): fix formatting by @jadz94 in 2741a22
- chore(ART-10056): fix formatting by @jadz94 in e738951
- chore(ART-10056): fix formatting by @jadz94 in 0c0714f
- chore(ART-10056): fix formatting by @jadz94 in 72b9d8d
- fix(deps): update dependency next to v15.1.7 by @Renovate Bot in 377a5b2

## [v1.3.8] - 2025-03-31

### Added

- feat(ART-12300): add debounce for handleScroll by @Antoine Dorard in d9b0ac4
- feat(ART-12300): change getInitials behavior: always include all letters if less than 3 names by @Antoine Dorard in 863dfbd
- feat(ART-12300): make return initials if the name is entirely lowercase by @Antoine Dorard in 3ea0b0a
- feat(ART-12300): exclude lower case letters for initials by @Antoine Dorard in 75de64b
- feat(ART-12300): add bottom navbar for small screens and dropdown menu for medium screens by @Antoine Dorard in 8135d02

### Changed

- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.5-1738870241 by @Renovate Bot in cb90e39
- refractor(ART12300): move avatar initials logic to src/utils by @Antoine Dorard in e4b28b3
- test(ART-12300): add test for getInitials by @Antoine Dorard in 4cd5016
- chore(deps): update dependency tailwindcss to v4 (#571) by @LNDS-Sysadmins in 394cada
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.5-1738661183 by @Renovate Bot in d1df398
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.5-1737939980 by @Renovate Bot in f20a268
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.5-1737619681 by @Renovate Bot in 048b597
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.5-1737562536 by @Renovate Bot in 58e2103
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.5-1737531032 by @Renovate Bot in b4486c1

### Fixed

- fix: revert tailwind v4 (#577) by @Kacem Bechka in 8ab24b0
- fix(ART-12300): fix typo by @Antoine Dorard in 5876007
- fix(ART-12300): remove unused icon from imports by @Antoine Dorard in 2ffed0e
- fix(deps): update dependency tailwind-merge to v3 (#573) by @LNDS-Sysadmins in 1ffdf13
- fix: ART-12303/custom text not displayed by @Kacem Bechka in 82584b2
- fix: ART-12303/custom text not displayed by @Kacem Bechka in d3288da
- style(ART-12300): fix format by @Antoine Dorard in 62836c9
- fix: ART-12303/custom text not displayed by @Kacem Bechka in fb0e0e9
- fix: ART-12303/custom text not displayed by @Kacem Bechka in ad5516d
- fix(deps): update dependency @opentelemetry/auto-instrumentations-node to ^0.56.0 by @Renovate Bot in e345102
- fix lint by @Kacem Bechka in f3aa36b
- fix test by @Kacem Bechka in d93aad7
- fix test by @Kacem Bechka in 7596638
- fix: ART-12382/missing form validation by @Kacem Bechka in 61c221a
- fix(deps): update dependency next to v15.1.6 by @Renovate Bot in 1069748

### Removed

- remove About link from small screens' navbar (link in the footer for all screen sizes) by @Antoine Dorard in 585b7ef
- refractor(ART-12300): loop through nav items to remove redundant code by @Antoine Dorard in 51e9760

## [v1.3.7] - 2025-03-25

### Added

- feat(ART-11336): add dataset type and frontend element to display it by @Antoine Dorard in a73f09b
- feat(ART-11570): simplify open api by @jadz94 in 0fa6e26
- feat(ART-11332): update customization by @jadz94 in 5bd3491
- feat(ART-11332): update login button by @jadz94 in 257e167
- feat(ART-11332): add license by @jadz94 in 73dbe1b
- feat(ART-11332): fix format by @jadz94 in 87bf61c
- feat(ART-11332): move customizations to separate folder by @jadz94 in c8f0991
- feat: ART-11337/intergrate otel dev by @Kacem Bechka in c4a5882

### Changed

- chore(deps): update dependency eslint-config-prettier to v10 by @Renovate Bot in eb52fcc
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.5-1736731764 by @Renovate Bot in 09fba4d
- chore: add missing variables by @Bruno Pacheco in cb8c958
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-22-minimal docker tag to v9.5-1736425083 by @Renovate Bot in 6362b8c
- chore: add labels to docker image by @Bruno Pacheco in 58fcd2e
- chore(ART-11570): polish by @jadz94 in 761a854
- chore(deps): upgrade nodejs base image by @Bruno Pacheco in 721ee0f
- chore(ART-11332): polish by @jadz94 in 2f3f044
- chore(ART-11570): update test script by @jadz94 in 8e4f6d3
- chore(ART-11570): update test script by @jadz94 in 17a87c1
- chore(ART-11332): refactor customizations by @jadz94 in d824f0f
- chore(deps): automerge in branches by @Bruno Pacheco in 1f3e96f
- chore: update legal.md by @Bruno Pacheco in 588ff34

### Fixed

- fix(deps): update dependency next to v15.1.5 by @Renovate Bot in 7dccd85
- chore: fix missing labels by @Bruno Pacheco in 182cade
- fix(ART-11336): remove formatDate around dcatType by @Antoine Dorard in c06f212
- fix(ART-11336): formatting by @Antoine Dorard in 1b54b32
- fix(ART-11336): update dataset type tooltip message by @Antoine Dorard in 79742be
- fix(ART-11336): change attribute 'type' to 'dcatType' by @Antoine Dorard in 53f06a5
- chore: fix REPOSITORY_URL by @Bruno Pacheco in 82ce5bc
- chore: fix github actions env variables by @Bruno Pacheco in b5902aa
- fix: react-19-upgrade by @Younès Adem in 0a582d5
- fix(ART-11336): fix typo in footer and README by @Antoine Dorard in 972605b
- fix(deps): update dependency next to v15.1.4 by @Renovate Bot in fbf227b
- fix(deps): update dependency npm-run-all2 to v7 by @Renovate Bot in f0ef7d0
- fix(deps): replace dependency npm-run-all with npm-run-all2 ^5.0.0 by @Renovate Bot in 435cc3e
- fix(deps): update react monorepo to v19 by @Renovate Bot in 78de24d
- chore(deps): automerge all types of patch PRs by @Bruno Pacheco in ecd3a09
- chore(deps): automerge patches by @Bruno Pacheco in aa7bbda

## [v1.3.6] - 2025-03-25

### Added

- feat: improve external service integration (#531) by @Younès Adem in 7c63c1a

### Changed

- chore(deps): update dependency eslint-config-next to v14.2.21 by @Renovate Bot in 0c66174
- chore: move sonar check to the end of the pipeline by @Bruno Pacheco in 133bd46
- chore(deps): upgrade typescript by @Bruno Pacheco in 23a0ab9
- chore(deps): upgrade multiple packages by @Bruno Pacheco in 6b0e814
- chore(deps): upgrade @types packages by @Bruno Pacheco in 587661c
- chore(deps): upgrade @radix-ui packages by @Bruno Pacheco in 37674b7
- chore(deps): upgrade @opentelemetry packages by @Bruno Pacheco in d4bbb04
- chore(deps): upgrade @headlessui by @Bruno Pacheco in 13abbbe
- chore(deps): upgrade @fortawesome packages by @Bruno Pacheco in e0f34a9
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-20-minimal docker tag to v9.5-1734514731 by @Renovate Bot in 1952ed3
- chore(deps): update dependency tailwindcss to v3.4.17 by @Renovate Bot in 2646215
- chore: update open-api-specifications by @Younès Adem in a9df88a
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-20-minimal docker tag to v9.5-1734309067 by @Renovate Bot in fd7e3fa
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-20-minimal docker tag to v9.5-1733824671 by @Renovate Bot in ba37fad
- chore(deps): update dependency eslint-config-next to v14.2.20 by @Renovate Bot in db3463a
- chore(deps): update devdependencies by @Renovate Bot in 8555ea8

### Fixed

- fix: infinite rendering on dataset page by @Younès Adem in 4d2a8d7
- fix(deps): update dependency next to v14.2.21 by @Renovate Bot in 613dd2f
- fix: upgrade class-variance-authority from 0.7.0 to 0.7.1 by @snyk-bot in b443c90
- fix: upgrade cmdk from 1.0.0 to 1.0.4 by @snyk-bot in 6d9f8d9
- fix: upgrade tailwind-merge from 2.5.3 to 2.5.5 by @snyk-bot in d379f5e
- fix(deps): update opentelemetry-js monorepo to ^0.56.0 by @Renovate Bot in a0668aa
- fix(deps): update dependency next to v14.2.20 by @Renovate Bot in 3f8322a
- fix(deps): update dependency next to v14.2.19 by @Renovate Bot in 1b9ffaa

## [v1.3.5] - 2025-03-25

### Added

- ART-10311/feat: add variant filters (#517) by @Younès Adem in 231f503
- feat: ART-9692/change themes in homepage by @Kacem Bechka in cb1b8aa
- feat: ART-9692/add themes and publishers by @Kacem Bechka in fd8b844

### Changed

- chore(deps): update registry.access.redhat.com/ubi9/nodejs-20-minimal docker tag to v9.5-1732617235 by @Renovate Bot in 2eb321f
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-20-minimal docker tag to v9 by @Renovate Bot in abcc901
- chore(deps): update aquasecurity/trivy-action action to v0.29.0 by @Renovate Bot in a49c1af
- update prettier version by @jadz94 in 81207b9
- update prettier version by @jadz94 in caf415a
- update prettier version by @jadz94 in 95d6ffd
- Revert "update prettier version" by @jadz94 in 99c0f04
- update prettier version by @jadz94 in 00a1570
- update prettier version by @jadz94 in 44f06d7
- chore(deps): bump cross-spawn from 7.0.3 to 7.0.6 by @dependabot[bot] in b1c8154
- chore(deps): update dependency tailwindcss to v3.4.15 by @Renovate Bot in cbc21d2
- chore(deps): update fsfe/reuse-action action to v5 by @Renovate Bot in e235e7b
- chore(deps): update dependency eslint-config-next to v14.2.18 by @Renovate Bot in 9705294
- Revert "chore(deps): update registry.access.redhat.com/ubi9/nodejs-20-minimal docker tag to v9" by @Kacem Bechka in 8c6a904
- addressing comments by @Kacem Bechka in de2547f
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-20-minimal docker tag to v9 by @Renovate Bot in d965b65
- chore(deps): update sonarsource/sonarqube-scan-action action to v4 by @Renovate Bot in f5f854b
- Feat/Introducing free text filters + removing filters from url (#499) by @Younès Adem in 25adf11

### Fixed

- Revert "fix(deps): update dependency next to v15" by @Bruno Pacheco in 635b5d9
- fix version issue by @jadz94 in ee9acfe
- fix(deps): update dependency next to v15 by @Renovate Bot in 9d50341
- fix(deps): update opentelemetry-js monorepo to ^0.55.0 by @Renovate Bot in 167e9f0
- fix: ART-10765/not showing filter labels in applied filters by @Kacem Bechka in afc1916
- fix(deps): update dependency date-fns to v4 by @Renovate Bot in 7125f46
- fix: ART-9692/displaying themes on homepage correctly (#511) by @Kacem Bechka in 7131c4b
- fix: reduce temporarily severity of trivy scanner to CRITICAL by @Bruno Pacheco in 7786377
- fix(deps): update dependency next to v14.2.18 by @Renovate Bot in 505fecf
- fix linter by @Kacem Bechka in 686d48a
- fix: free text values sync with global states (#503) by @Younès Adem in 13c3284

## [v1.3.4] - 2025-03-25

### Added

- feat: add languages to distribution by @Bruno Pacheco in fb88eb4

## [v1.3.3] - 2025-03-25

### Added

- feat: sort datasets by issue date by @Bruno Pacheco in 716b8d6
- feat: add otel by @Bruno Pacheco in a926626
- feat: ART-10196/Header changes (#493) by @Kacem Bechka in ba3248c
- feat: align with new dataset search endpoint by @Younès Adem in 8b18e36
- feat: add free text filters by @Younès Adem in 094b427
- feat: display distributionsCount and downloadUrl by @Bruno Pacheco in ee35ebd
- feat: display coniditional fields properly by @Sulejman Karisik in ae69afa

### Changed

- chore(deps): update dependency eslint-config-next to v14.2.17 by @Renovate Bot in 1e33c08
- chore: use cached trivy db by @Bruno Pacheco in 1e9b91c
- chore: cache trivy db by @Bruno Pacheco in 20b855d
- chore(deps): update dependency eslint-config-next to v14.2.16 (#486) by @LNDS-Sysadmins in f857f26
- chore(deps): update dependency tailwindcss to v3.4.14 by @Renovate Bot in 94b432e
- chore(deps): update aquasecurity/trivy-action action to v0.28.0 by @Renovate Bot in 1c9ae08
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-20-minimal docker tag to v1-63.1726695170 by @Renovate Bot in 7d1154f
- docs: update CHANGELOG.md by @Bruno Pacheco in 9db8b6e
- docs: update CHANGELOG.md by @Bruno Pacheco in 7673372
- chore(deps): update dependencies by @Bruno Pacheco in b1fb3ef
- chore(deps): update aquasecurity/trivy-action action to v0.27.0 (#480) by @LNDS-Sysadmins in 6609945

### Fixed

- fix(deps): update dependency next to v14.2.17 by @Renovate Bot in 5f2ffae
- fix: run prettier on yml files by @Bruno Pacheco in c207483
- fix: do checks in same iteration by @Sulejman Karisik in b3b03ec
- fix: multiple themes not displaying correctly by @Younès Adem in 5207059
- fix(deps): update dependency next to v14.2.16 (#487) by @LNDS-Sysadmins in 3057350
- fix(docs): run prettier on CHANGELOG.md by @Bruno Pacheco in c6e51db

## [v1.3.2] - 2024-10-09

### Changed

- chore(deps): update aquasecurity/trivy-action action to v0.26.0 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/479
- fix(deps): update dependency next to v14.2.15 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/478
- chore(deps): update dependency eslint-config-next to v14.2.15 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/477

### Fixed

- fix: remove padding on applications and entitlements page + remove bu… by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/476

## [v1.3.1] - 2024-10-07

### Changed

- feat: extract card component for consistency + minor ui fixes by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/474

## [v1.3.0] - 2024-10-07

### Added

- 253 gdi frontend support text typed fields by @sulejmank in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/260
- feat: Implement configurable fonts and colors by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/267
- feat: remove specific color names + default values for fonts and colors by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/268
- ART-6884: dark mode similar to light mode by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/270
- Add email, date and phone number fields by @EmiPali in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/266
- feat: Unified Error handling by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/279
- 264 gdi frontend design and develop entitlement card by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/284
- feat: Renovate bot config file by @sehaartuc in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/286
- chore: export dataset into different formats by @brunopacheco1 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/371
- feat: #363 display contact points by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/375
- feat: #360 Organization Page/details by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/380
- feat: themes component to homepage by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/342
- feat: Themes Page and filter by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/350
- feat: #281 accept terms and conditions by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/387

### Changed

- chore(deps): update docker/build-push-action action to v6 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/297
- chore(deps): update fsfe/reuse-action action to v4 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/298
- chore(deps): update docker/metadata-action digest to a64d048 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/291
- chore(deps): update oss-review-toolkit/ort-ci-github-action digest to 81698a9 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/292
- chore(deps): update docker/login-action digest to 0d4c9c5 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/290
- chore(deps): update devdependencies by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/293
- fix(deps): update dependency utils to ^0.3.0 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/295
- chore(deps): update azure/webapps-deploy digest to 5c1d76e by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/289
- fix(deps): update dependency next to v14.2.5 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/294
- fix(deps): update dependency cmdk to v1 - autoclosed by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/300
- feat: footer content is configurable by env vars by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/306
- feat: restructure footer by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/308
- feat: header configurable by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/309
- feat: Prettier config fixed by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/311
- feat: howto banner should be permanent by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/312
- feat: homepage about page should be dynamic by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/323
- feat: fix layout of homepage about by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/336
- fix: change heroicon to fontawesome by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/337
- Improve phone field by @EmiPali in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/285
- feat: #273 display Recents Datasets on homepage by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/341
- chore: centralize env vars in server config by @brunopacheco1 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/343
- fix(deps): update dependency lucide-react to ^0.408.0 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/338
- fix(deps): update dependency lucide-react to ^0.411.0 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/345
- fix(deps): update dependency lucide-react to ^0.412.0 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/348
- LNDC design for themes by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/347
- fix(deps): update dependency lucide-react to ^0.414.0 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/349
- chore: separate content from service configurations by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/351
- fix(deps): update dependency lucide-react to ^0.416.0 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/352
- feat: #261 made support fields uneditable by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/353
- fix(deps): update dependency lucide-react to ^0.417.0 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/359
- feat: dataset detail page by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/358
- fix(deps): update dependency lucide-react to ^0.418.0 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/365
- fix(deps): update dependency lucide-react to ^0.419.0 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/367
- fix(deps): update dependency lucide-react to ^0.424.0 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/368
- chore: migrate base docker image to UBI9 by @brunopacheco1 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/374
- fix(deps): update dependency lucide-react to ^0.426.0 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/381
- fix(deps): update dependency lucide-react to ^0.427.0 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/382
- feat: #278 replace date-picker by shadcn date-picker by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/383
- chore: add test coverage to sonar cloud by @brunopacheco1 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/390
- chore: remove unnecessary functions and fix API mapping by @brunopacheco1 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/393
- feat: revise themes, publishers and about pages by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/391
- fix: add tests for about renderer by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/394
- feat: homepage ui by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/388
- chore: #ART-8080 reduce duplicated error handling code by @brunopacheco1 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/395
- chore: handle ErrorResponse in form by @brunopacheco1 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/397
- chore: rename organization to publisher by @brunopacheco1 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/398
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-20-minimal docker tag to v1-57.1724037293 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/401
- chore(deps): update dependency eslint-config-next to v14.2.6 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/404
- fix(deps): update dependency next to v14.2.6 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/405
- feat: #378 change the filters component by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/407
- feat: remove image from organization page by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/410
- feat: #378 add Skeleton for datasetpage and pagination overhaul by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/413
- fix filter dropdown if empty by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/414
- fix border in small screen between info by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/415
- feat: for publisher, client side rendering changed to server side rendering by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/416
- fix basket color by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/417
- fix: about content in the same folder as other public resources. by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/418
- fix: footer logo and about content by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/421
- Get correct offset with pagination by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/422
- feat: #370 support REMS option list, multi-select list, label and header field types by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/423
- feat: #389 support REMS Table field type by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/424
- fix: the border and invalid value in the form by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/426
- chore(deps): update dependency eslint-config-next to v14.2.7 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/419
- fix(deps): update dependency next to v14.2.7 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/420
- chore(deps): bump micromatch from 4.0.5 to 4.0.8 by @dependabot in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/425
- Revert "chore(deps): bump micromatch from 4.0.5 to 4.0.8" by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/427
- chor(deps): upgrade tailwind for micromatch vulnerability by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/431
- fix: add correct font files by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/433
- chore: clean up of unused components and minor refactor by @sulejmank in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/436
- feat: #399 use react-markdown for loading markdown file content as st… by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/437
- feat: #403 add documentation about frontend customization by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/439
- fix not needed underline in md files by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/440
- 430/get facets from new endpoint by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/441
- fix: keywords showing Dataset Card by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/442
- move the favicon to public folder by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/443
- Decommision facet groups by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/444
- feat: add distributions to dataset card and fix error layout by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/445
- Fix: responsiveness for portal by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/446
- chore(deps): update registry.access.redhat.com/ubi9/nodejs-20-minimal docker tag to v1-63.1725851021 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/432
- chore(deps): update devdependencies (patch) by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/434
- fix(deps): update dependency date-fns to v4 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/447
- feat: change the color of the form text from primary to black by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/448
- fix(deps): update dependency next to v14.2.10 [security] by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/452
- chore(deps): update devdependencies (patch) by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/450
- fix(deps): update dependency next to v14.2.13 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/435
- chore(deps): update dependency eslint-config-next to v14.2.13 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/453
- fix: ART-9683/Filter not working by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/454
- fix: the overflow of themes in dataset card and removing the icon by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/455
- chore(deps): update dependency tailwindcss to v3.4.13 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/456
- Move, images fonts and palette to public by @brunopacheco1 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/459
- chore(deps): update sonarsource/sonarqube-scan-action action to v3 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/460
- feat: add sitemap.xml and robots.txt by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/458
- feat: ART-9568/add feature flag for access request by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/461
- chore: change font names by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/462
- chore: fix RDF file export by @brunopacheco1 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/464
- Feat/delete draft action by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/463
- fix: add missing body to makeDeleteApplication by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/465
- fix: revert changes on DELETE verb by @brunopacheco1 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/466
- ART-9681/Display selected filters on top of the dataset cards by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/468
- ART-9680/Small enhancements by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/471
- chore(deps): update dependency eslint-config-next to v14.2.14 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/469
- fix(deps): update dependency next to v14.2.14 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/470
- Align layout for applications and entitlements by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/472
- chore: minor refactoring by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/473
- chore(deps): update aquasecurity/trivy-action action to v0.25.0 by @LNDS-Sysadmins in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/475

### Fixed

- fix: Throw full page error for 404 on application page by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/280
- fix: layout by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/282
- fix: Close alert when navigating to other page by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/283
- feat: #272 review homepage layout by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/318
- fix search bar placeholder by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/321
- fix: border and colour highlight by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/354
- fix: hover and colour consistency on application form fields by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/356
- fix: hover upload button opacity by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/357
- fix: alignment of tile and dates on small screens by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/361
- fix: fix organization link fix distribution box and add info box by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/362
- fix: #355 session always expires after 5 min by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/366
- fix: #364 error of missing timezone in console by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/372
- fix: add more tests for make sonar happy by @zalborzi in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/396
- feat: #378 remove fitler icon for small screen by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/408
- feat: debounce save form to prevent race condition by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/406
- feat: #378 dataset card revamp by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/411
- fix: Phone number onChange event by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/409

## [v1.2.0] - 2024-06-12

### Added

- feat: Setup GDI Brand fonts by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/81
- feat: #56 add state management and router by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/82
- feat: Add GDI branding color schemes by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/83
- feat: setup Icons, Style header by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/85
- feat: add footer + disclaimer + active tab in header by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/86
- feat: CKAN packageSearch client, Dataset interface and unit testing by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/88
- feat: Handling Errors by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/89
- feat: Error handling for server-side 404 by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/90
- feat: Improve types and CKAN service naming based on business domain by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/91
- feat: #59 Develop About page by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/93
- feat: Dataset details page with tags by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/99
- feat: add authentification and new style features & style to header by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/100
- feat: dataset details page sidebar by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/102
- feat: consistent colouring by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/103
- feat: dataset details distribution accordion by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/104
- feat: Dataset details coloring by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/106
- feat: #57 Implement dataset counter by @EmiPali in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/109
- feat: #58 dataset page by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/111
- feat: Add to basket button, And DatasetBasketProvider by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/113
- feat: # 57 Implement Full Homepage by @EmiPali in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/110
- feat: Basket list page by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/114
- feat: Add to Basket button on dataset details page by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/116
- feat: Make DatasetCounter and PortalStatistics components as client component to improve performance by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/118
- feat: Alert Box by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/119
- feat: Wire Request now btn to create application endpoint by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/120
- feat: static application details page by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/151
- feat: responsiveness for application details page by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/153
- feat: #66 develop applications page by @sulejmank in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/154
- feat: PageContainer, CenteredListContainer, List, ListItem common components by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/156
- feat: replace list endpoints by package_search by @brunopacheco1 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/157
- feat: Application icon in header by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/160
- feat: Enhanced Applications Page by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/162
- feat: Link Application Details page in the list view by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/168
- feat: use tailwind by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/174
- feat: Redirect to application page on success by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/186
- feat: #152 gdi frontend integrate with dataset discovery service by @sulejmank in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/190
- feat: Make errors more informative by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/196
- feat: Improve loading message, remove disclaimer by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/207
- feat: add dataset-discovery-service src by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/209
- feat: Remove identifiers links and show record count by @brunopacheco1 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/210
- feat: put back margin by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/226
- feat: improve error handling and displaying by @EmiPali in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/236
- feat: #60 request page by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/240
- feat: #243 gdi frontend display granted datasets by @sulejmank in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/257
- feat: add query operator to dataset search by @sulejmank in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/258
- feat: hide date on entitlmenets by @sulejmank in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/259

### Changed

- chore: Rename components by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/211
- chore: #69 test application routes by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/216
- refactor: #128 remove white background from existing favicon by @EmiPali in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/247
- chore(deps): bump next from 14.1.0 to 14.1.1 by @dependabot in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/248
- chore: vulnerability Scan Weekly - Licenses by @sehaartuc in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/249
- chore: add changelog and improve github actions by @brunopacheco1 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/71
- chore: #7 add REUSE standards by @brunopacheco1 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/72
- doc: #54 Review CONTRIBUTING.md by @brunopacheco1 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/73
- chore: Install typescrit, nextjs, react and teailwind with default configs by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/76
- chore: #56 eslint prettier config by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/87
- chore: #96 dockerize the frontend by @brunopacheco1 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/98
- chore(deps): bump ip from 2.0.0 to 2.0.1 by @dependabot in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/101
- chore: dataset page/improve search bar by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/112
- chore(deps): bump jose from 4.15.4 to 4.15.5 by @dependabot in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/123
- chore: NextJS expects env variables to be fetched statically by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/140
- chore(deps): bump follow-redirects from 1.15.5 to 1.15.6 by @dependabot in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/142
- chore: Enforce order of metadata tags by @hcvdwerf in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/146
- chore: improved performance of counters by caching results by @Markus92 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/143
- refactor: Move dataset list page to pure client side by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/184
- chore: improve UI value labels by @brunopacheco1 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/201
- chore: #197 improve dynamic filters presentation by @sulejmank in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/205
- doc: #55 Improve README.md by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/79

### Fixed

- fix: REUSE compliance and linting issues by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/80
- fix: add type check in CI and remove eot fonts (only needed to support IE 6-IE 8 and is not supported by nextjs) by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/92
- fix: #95 The actions menu dropdown does not close by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/97
- fix: date format by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/107
- fix: primary is secondary and vice-versa by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/108
- fix: loading btn turning into logged in user on page reload by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/121
- fix: use correct colors by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/122
- fix: Prepend NEXT*PUBLIC* before env variables to make it available in both client and backend by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/139
- fix: Home page improvements by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/141
- fix(azure-deployment): Trigger repull on new catalogue version by upd… by @hcvdwerf in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/137
- fix: #125 Fix Lucene query by @brunopacheco1 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/144
- fix: fix search bar enhancement by @EmiPali in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/145
- fix: use next-runtime-env for picking up at runtime NEXT_PUBLIC envir… by @hcvdwerf in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/148
- fix: Make DAAM URL public by @hcvdwerf in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/149
- fix: improve header and overall responsiveness by @sulejmank in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/163
- fix: revert to previus layout homepage by @sulejmank in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/164
- fix: title is a label not string by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/166
- fix: Do not crash if date is invalid by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/165
- fix: Dataset Url by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/167
- fix: filter options are updating correctly by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/170
- fix: unnecessary text selection during expansion by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/172
- fix: remove link from avatar menu, add it to small screen menu by @sulejmank in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/173
- fix: added icon for application link by @sulejmank in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/175
- fix: spacing and filter icon by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/176
- fix filter list close icon location by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/178
- fix: search bar width by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/177
- fix: FilterList button colors, height and dataset item colors and chip colors by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/180
- fix: Applications page error handling by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/181
- fix pagination links browser errors and colors by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/182
- fix: spacing by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/185
- fix: minor fixes in Basket and Applications pages by @brunopacheco1 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/187
- fix: return createApplication response from nextjs backend by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/189
- fix: Dataset details page improvements by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/193
- fix: Longggg title and container spacing by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/195
- fix: Description can be optional by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/199
- fix: provide client secret while refreshing token by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/204
- fix: #191 blocked eval scr issue by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/198
- fix: fix if csp is empty by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/208
- fix: #69 application details page/file upload by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/194
- fix: #188 update loading message for datasets search by @nolliia in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/213
- fix: send identifier to create application by @EmiPali in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/214
- fix: fix for disabling buttons by @EmiPali in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/215
- fix: fix for undefined application id when redirecting from basket to applications details by @EmiPali in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/221
- fix: fetch application request fails silently and makes renedering is… by @sulejmank in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/254
- fix: #225 refresh token error by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/252
- fix: #203 fix redirecting to first element when pressing enter to search by @EmiPali in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/250
- fix: application details path by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/246
- fix: make sidebar client component by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/245
- Fix for removing logic duplication for handling application submission errors by @EmiPali in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/242
- fix: Application Layout spacing by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/230
- fix: navigation hover colors and highlight them when active by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/232
- fix: Date format, improve sidebar item values by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/231
- fix: Dont refetch datasets on resizing window by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/235
- fix: Show error if application submission fails by @inderps in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/234
- fix: remove formatting for ErrorMessages by @EmiPali in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/244
- fix: #69 fix discrepancies by @admy7 in https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/pull/224

## [v1.0.0] - 2024-01-30

### Added

- Homepage with search bar.
- OIDC integration for user authentication.
- Box with catalogue statistics to homepage.
- datasets page for searching datasets.
- basic filters on datasets: publishers, catalogues, themes and keywords.
- sorting datasets by: relevance, last created and last modified.
- about page with short details on User Portal and Genomic Data Infrastructure.
- disclaimer about Milestone 11.
- GDI Look&Feel.
- footer with GDI project details and useful links.
