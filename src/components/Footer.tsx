import * as React from 'react';

interface FooterProps {
  author: string;
  github: string;
}

export const Footer = function ({ author, github }: FooterProps) {
  return (
    <footer
      className="field-row"
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
      <button
        onClick={() => {
          window.location.href = github;
        }}
        style={{
          padding: '0.1rem 0',
          width: '10rem',
        }}
      >
        Github
      </button>
    </footer>
  );
};
