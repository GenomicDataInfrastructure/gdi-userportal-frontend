---
slug: /developer-guide/theming
sidebar_label: "Frontend customisation"
sidebar_position: 8
---

# Frontend customisation

:::info content in progress

We are working on this guide.

:::

The GDI User Portal offers extensive customisation options through configuration files and public assets. This guide will help you understand how to customise various aspects of the portal.

## Configuration options

The following configuration options can be set in the `properties.json` file:

| Variable Name                      | Explanation                                     | Example Value                                             |
| ---------------------------------- | ----------------------------------------------- | --------------------------------------------------------- |
| NEXT_PUBLIC_SITE_TITLE             | Main title of the website                       | "GDI - User Portal"                                       |
| NEXT_PUBLIC_SITE_DESCRIPTION       | Brief description of the site                   | "Genomic Data Infrastructure User Portal"                 |
| NEXT_PUBLIC_HOMEPAGE_TITLE         | Main heading on the homepage                    | "WELCOME TO GDI"                                          |
| NEXT_PUBLIC_HOMEPAGE_SUBTITLE      | Subheading text on the homepage                 | "The Genomic Data Infrastructure (GDI) project..."        |
| NEXT_PUBLIC_HOMEPAGE_ABOUT_CONTENT | Detailed content for the about section          | "The Genomic Data Infrastructure (GDI) homepage..."       |
| NEXT_PUBLIC_BANNER_LINK            | Navigation link for the banner                  | "/howto"                                                  |
| NEXT_PUBLIC_FOOTER_TEXT            | Text displayed in the footer                    | "GDI project receives funding from the European Union..." |
| NEXT_PUBLIC_LINKEDIN_URL           | LinkedIn social media link                      | "https://www.linkedin.com/company/gdi-euproject/"         |
| NEXT_PUBLIC_TWITTER_URL            | Twitter/X social media link                     | "https://twitter.com/GDI_EUproject"                       |
| NEXT_PUBLIC_GITHUB_URL             | GitHub repository link                          | "https://github.com/GenomicDataInfrastructure"            |
| NEXT_PUBLIC_WEBSITE_URL            | Main project website link                       | "https://gdi.onemilliongenomes.eu/"                       |
| NEXT_PUBLIC_EMAIL                  | Contact email address                           | "gdi-coordination@elixir-europe.org"                      |
| NEXT_PUBLIC_SHOW_BASKET_AND_LOGIN  | Feature flag for basket and login functionality | "true"                                                    |

## Public assets customisation

The portal's appearance can be customised through various files in the `/public` directory:

### Core configuration files

1. `properties.json`: Contains main site configuration including:
   - Site title and description
   - Homepage content and titles
   - Social media links
   - Contact information
   - Footer text
   - Feature flags

2. `palette.css`: Defines the colour scheme including:
   - Primary and secondary colours
   - Info and warning colours
   - Hover states
   - Surface colours
   - Dark mode support

### Visual assets

1. **Logos**:
   - `header-logo.svg`: Main logo displayed in the header
   - `footer-logo.png`: Logo displayed in the footer
   - `favicon.ico`: Browser tab icon

2. **Images**:
   - `homepage-about-background.png`: Background image for the about section

### Typography

1. `fonts.css`: Custom font definitions and typography settings
2. `fonts/` directory: Contains custom font files

### Content files

1. `about.md`: About page content
2. `howto.md`: How-to guide content
3. `legal.md`: Legal information and terms

## Customisation best practices

1. **Colours**:
   - Use the `palette.css` file to maintain consistent branding
   - Consider both light and dark mode colour schemes
   - Ensure sufficient contrast for accessibility

2. **Typography**:
   - Add custom fonts to the `fonts/` directory
   - Define font faces in `fonts.css`
   - Maintain consistent font usage throughout the application

3. **Content**:
   - Keep content in markdown files for easy maintenance
   - Update `properties.json` for site-wide text changes
   - Maintain proper licensing information in `.license` files

4. **Images**:
   - Use SVG format for logos when possible
   - Optimise image sizes for web performance
   - Include appropriate alt text in implementation

5. **Environment variables**:
   - Use different values for development, staging, and production
   - Keep sensitive values secure
   - Document any new variables added to the system
