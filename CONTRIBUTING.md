<!--
SPDX-FileCopyrightText: 2025 PNED G.I.E.

SPDX-License-Identifier: CC-BY-4.0
-->

<!-- omit in toc -->

# Contributing to GDI User Portal Front-end

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions. 🎉

> And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about:
>
> - Star the project
> - Tweet about it
> - Refer this project in your project's readme
> - Mention the project at local meetups and tell your friends/colleagues

<!-- omit in toc -->

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Improving The Documentation](#improving-the-documentation)
- [Styleguides](#styleguides)
  - [Commit Messages](#commit-messages)
  - [TypeScript Styleguide](#typescript-styleguide)
  - [License and Copyrights](#license-and-copyrights)
- [Join The Project Team](#join-the-project-team)

## Code of Conduct

This project and everyone participating in it is governed by the
[GDI User Portal Front-end Code of Conduct](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/blob/main/CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable behavior
to <gdi-WP4@elixir-europe.org>.

## I Have a Question

> If you want to ask a question, we assume that you have read the available [Documentation](https://genomicdatainfrastructure.github.io/gdi-userportal-docs/).

Before you ask a question, it is best to search for existing [Issues](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

If you then still feel the need to ask a question and need clarification, we recommend the following:

- Open an [Issue](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/issues/new).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, etc), depending on what seems relevant.

We will then take care of the issue as soon as possible.

## I Want To Contribute

> ### Legal Notice <!-- omit in toc -->
>
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license.

### Reporting Bugs

<!-- omit in toc -->

#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Determine if your bug is really a bug and not an error on your side e.g. using incompatible environment components/versions (Make sure that you have read the [documentation](https://genomicdatainfrastructure.github.io/gdi-userportal-docs/). If you are looking for support, you might want to check [this section](#i-have-a-question)).
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your bug or error in the [bug tracker](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/labels/bug)
- Also make sure to search the internet (including Stack Overflow) to see if users outside of the GitHub community have discussed the issue.
- Collect information about the bug:
  - Stack trace (Traceback)
  - OS, Platform and Version (Windows, Linux, macOS, x86, ARM)
  - Version of the interpreter, compiler, SDK, runtime environment, package manager, depending on what seems relevant.
  - Possibly your input and the output
  - Can you reliably reproduce the issue? And can you also reproduce it with older versions?

<!-- omit in toc -->

#### How Do I Submit a Good Bug Report?

> You must never report security related issues, vulnerabilities or bugs including sensitive information to the issue tracker, or elsewhere in public. Instead sensitive bugs must be sent by email to <gdi-WP4@elixir-europe.org>.

We use GitHub issues to track bugs and errors. If you run into an issue with the project:

- Open an [Issue](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/issues/new). (Since we can't be sure at this point whether it is a bug or not, we ask you not to talk about a bug yet and not to label the issue.)
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible and describe the _reproduction steps_ that someone else can follow to recreate the issue on their own. This usually includes your code. For good bug reports you should isolate the problem and create a reduced test case.
- Provide the information you collected in the previous section.

Once it's filed:

- The project team will label the issue accordingly.
- A team member will try to reproduce the issue with your provided steps. If there are no reproduction steps or no obvious way to reproduce the issue, the team will ask you for those steps and mark the issue as `needs-repro`. Bugs with the `needs-repro` tag will not be addressed until they are reproduced.
- If the team is able to reproduce the issue, it will be marked `needs-fix`, as well as possibly other tags (such as `critical`), and the issue will be left to be [implemented by someone](#your-first-code-contribution).

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for GDI User Portal Front-end, **including completely new features and minor improvements to existing functionality**. Following these guidelines will help maintainers and the community to understand your suggestion and find related suggestions.

<!-- omit in toc -->

#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Read the [documentation](https://genomicdatainfrastructure.github.io/gdi-userportal-docs/) carefully and find out if the functionality is already covered, maybe by an individual configuration.
- Perform a [search](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/issues) to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.
- Find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature. Keep in mind that we want features that will be useful to the majority of our users and not just a small subset. If you're just targeting a minority of users, consider writing an add-on/plugin library.

<!-- omit in toc -->

#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend/issues).

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point you can also tell which alternatives do not work for you.
- You may want to **include screenshots and animated GIFs** which help you demonstrate the steps or point out the part which the suggestion is related to. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
- **Explain why this enhancement would be useful** to most GDI User Portal Front-end users. You may also want to point out the other projects that solved it better and which could serve as inspiration.

### Your First Code Contribution

#### Setting Up Your Development Environment

To contribute to this project, you will need to set up your development environment. Here are the steps to get started:

1. **Clone the repository**: Start by cloning the project repository to your local machine using the following command:

```bash
% git clone https://github.com/GenomicDataInfrastructure/gdi-userportal-frontend.git
```

2. **Install dependencies**: Navigate to the project directory and install the required dependencies using npm. Run the following command:

```bash
% cd gdi-userportal-frontend
% npm install
```

3. **Configure environment variables**: The project may require certain environment variables to be set. Check the project documentation or ask the project team for the required variables and their values.

4. **Set up your IDE**: Open the project in your preferred Integrated Development Environment (IDE). We are using VSCode and you can find initial setup for `.vscode/launch.json`, `.vscode/tasks.json` and `.vscode/extensions.json`.

5. **Start the development server**: Once your environment is set up, you can start the development server to preview and test your changes. Run the following command:

```bash
npm start
```

This will start the development server and open the project in your default web browser.

#### Getting Started

To get started with contributing to this project, follow these steps:

1. **Familiarize yourself with the project**: Read the project documentation and familiarize yourself with the project structure, code conventions, and existing features.

2. **Choose an issue to work on**: Browse the project's issue tracker and choose an issue that you would like to work on. Make sure to check if the issue is already assigned to someone else or if it has been marked as "help wanted" or "good first issue" for new contributors.

3. **Create a new branch**: Create a new branch for your changes based on the latest `main` branch. Use a descriptive branch name that reflects the issue you are working on. For example:

```bash
git checkout -b fix-bug-123
```

4. **Make your changes**: Implement the necessary changes to address the issue you have chosen. Follow the project's coding conventions and styleguides.

5. **Test your changes**: Before submitting your changes, make sure to test them thoroughly. Run the project's test suite and verify that all existing tests pass. If necessary, write new tests to cover your changes.

6. **Commit and push your changes**: Once you are satisfied with your changes, commit them to your branch and push them to the remote repository. Use a clear and descriptive commit message to explain your changes.

```bash
git add .
git commit -m "Fix bug #123: Description of the fix"
git push origin fix-bug-123
```

7. **Create a pull request**: Go to the project's repository on GitHub and create a new pull request. Provide a clear and detailed description of your changes, including any relevant context or screenshots.

8. **Review and address feedback**: The project team will review your pull request and provide feedback or suggestions for improvement. Make the necessary changes based on the feedback received.

9. **Merge your changes**: Once your pull request has been approved, it will be merged into the main branch. Congratulations on your contribution!

Please note that these instructions are general guidelines and may vary depending on the specific project. Make sure to consult the project's documentation and communicate with the project team for any project-specific instructions or requirements.

### Improving The Documentation

To contribute to the documentation, read the [documentation readme](documentation/README.md).

## Styleguides

### Commit Messages

- Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
- Use a concise and descriptive message to summarize the changes made in the commit.
- Start the message with a verb in the imperative form, such as "Fix", "Add", "Update", etc.
- Limit the message to 72 characters or less for better readability.
- Provide additional details in the commit body if necessary.

### TypeScript Styleguide

All TypeScript code is linted with [Prettier](https://prettier.io/).

### License and Copyrights

We are [REUSE](https://reuse.software/) compliant. All files must contain copyrights and license on the header.

## Attribution

This guide is based on the **contributing-gen**. [Make your own](https://github.com/bttger/contributing-gen)!
