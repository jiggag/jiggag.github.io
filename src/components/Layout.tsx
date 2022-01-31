import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header';
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

  const [isMaximize, setIsMaximize] = React.useState(!!localStorage.getItem('maximize'));

  const toggleMaximize = React.useCallback(() => {
    setIsMaximize(prev => {
      if (prev) {
        localStorage.removeItem('maximize');
      } else {
        localStorage.setItem('maximize', 'true');
      }

      return !prev;
    });
  }, []);

  const onClose = React.useCallback(() => {
    window.history.back();
  }, []);

  const onPressGithub = React.useCallback(() => {
    window.location.href = data.site.siteMetadata.github;
  }, [data.site.siteMetadata.github]);

  return (
    <div className={`window ${isMaximize ? 'maximize' : 'minimize'}`}>
      <div className="window-container">
        <Header siteTitle={data.site.siteMetadata.title} isMaximize={isMaximize} toggleMaximize={toggleMaximize} onClose={onClose} />
        {customHeader}
        <main className="window-body">
          {children}
        </main>
        <Footer author={data.site.siteMetadata.author} onPressGithub={onPressGithub} />
      </div>
    </div>
  );
};
