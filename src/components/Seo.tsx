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
  keywords?: string;
}

export const Seo = function ({
  description: descriptionProps = '', lang = 'ko', meta: metaProps = [], keywords = '', title,
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

  const description = descriptionProps || site.siteMetadata.description;
  const meta: HelmetProps['meta'] = [
    { name: 'keywords', content: keywords },
    {
      name: 'description',
      content: description,
    },
    {
      name: 'twitter:title',
      content: title,
    },
    {
      name: 'twitter:description',
      content: description,
    },
    {
      name: 'twitter:card',
      content: 'summary',
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    ...metaProps,
  ];

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={meta}
    />
  );
};
