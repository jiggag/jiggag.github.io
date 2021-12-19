import * as React from 'react';

interface FooterProps {
  author: string;
  github: string;
}

export const Footer = function ({ author, github }: FooterProps) {
  return (
    <footer
      style={{
        width: '100%',
        display: 'inline-flex',
        padding: '1rem 1.5rem',
      }}
    >
      <div style={{
        width: '100%',
        alignSelf: 'flex-end',
      }}
      >
        {`${author}, Built with `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </div>
      <a
        href={github}
        style={{
          color: 'black',
          textDecoration: 'none',
        }}
      >
        <div style={{
          border: '1px solid',
          textAlign: 'center',
          padding: '0.1rem 0',
          width: '7rem',
          boxShadow: 'rgba(0, 0, 0, 0.5) 1.95px 1.95px 2.6px',
        }}
        >
          Github
        </div>
      </a>
    </footer>
  );
};
