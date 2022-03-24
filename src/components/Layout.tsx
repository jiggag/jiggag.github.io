import React, {
  useEffect, useState, useCallback, ReactNode, useRef,
} from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header';
import './main.css';
import { Site } from 'types';

interface LayoutProps {
  customHeader?: ReactNode;
  children: ReactNode;
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

  const mainRef = useRef<HTMLElement>(null);
  const [isMaximize, setIsMaximize] = useState(false);

  const toggleMaximize = useCallback(() => {
    setIsMaximize(prev => {
      if (prev) {
        localStorage.removeItem('maximize');
      } else {
        localStorage.setItem('maximize', 'true');
      }

      return !prev;
    });
  }, []);

  const onClose = useCallback(() => {
    window.history.back();
  }, []);

  const onPressGithub = useCallback(() => {
    window.location.href = data.site.siteMetadata.github;
  }, [data.site.siteMetadata.github]);

  const onScrollToTop = useCallback(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    setIsMaximize(!!localStorage.getItem('maximize'));
  }, []);

  return (
    <div className={`window ${isMaximize ? 'maximize' : 'minimize'}`}>
      <div className="window-container">
        <Header
          siteTitle={data.site.siteMetadata.title}
          isMaximize={isMaximize}
          toggleMaximize={toggleMaximize}
          onClose={onClose}
          onScrollToTop={onScrollToTop}
        />
        {customHeader}
        <main className="window-body" ref={mainRef}>
          {children}
        </main>
        <Footer author={data.site.siteMetadata.author} onPressGithub={onPressGithub} />
      </div>
    </div>
  );
};
