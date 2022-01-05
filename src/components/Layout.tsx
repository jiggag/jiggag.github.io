/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header';
import './layout.css';
import './main.css';
import '98.css';
import { Site } from 'types';

interface LayoutProps {
  customHeader?: React.ReactNode;
  children: React.ReactNode;
}

export const Layout = function ({ customHeader, children }: LayoutProps) {
  const data = useStaticQuery<Site>(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          author
          github
        }
      }
    }
  `);

  return (
    <div
      className="window"
      style={{
        height: '100vh',
      }}
    >
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      >
        <Header siteTitle={data.site.siteMetadata.title} />
        {customHeader}
        <main
          className="window-body"
          style={{
            overflow: 'auto',
            flex: 1,
            margin: 0,
          }}
        >
          {children}
        </main>
        <Footer author={data.site.siteMetadata.author} github={data.site.siteMetadata.github} />
      </div>
    </div>
  );
};
