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
    <div style={{
      padding: '3px 3px',
      height: '100vh',
    }}
    >
      <div style={{
        boxShadow: 'rgba(9, 30, 66, 0.75) 0px 1px 1px, rgba(9, 30, 66, 0.33) 0px 0px 2px 1px',
        padding: '2px 2px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#d7d0c5',
      }}
      >
        <Header siteTitle={data.site.siteMetadata.title} />
        {customHeader}
        <main style={{
          overflow: 'auto',
          flex: 1,
        }}
        >
          {children}
        </main>
        <Footer author={data.site.siteMetadata.author} github={data.site.siteMetadata.github} />
      </div>
    </div>
  );
};
