/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Helmet, HelmetProps } from 'react-helmet';
import { Site } from 'types';

interface SeoProps {
  description?: string;
  lang?: string;
  meta?: HelmetProps['meta'];
  title: string;
}

export const Seo = function ({
  description = '', lang = 'ko', meta = [], title,
}: SeoProps) {
  const { site } = useStaticQuery<Site>(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `,
  );

  const metaDescription = description || site.siteMetadata.description;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={([
        {
          name: 'description',
          content: metaDescription,
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: metaDescription,
        },
        {
          property: 'og:type',
          content: 'website',
        },
      ] as HelmetProps['meta']).concat(meta)}
    />
  );
};
