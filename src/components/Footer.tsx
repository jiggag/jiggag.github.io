import * as React from 'react';

interface FooterProps {
  author: string;
  github: string;
}

export const Footer = function ({ author, github }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer-label">
        {`${author}, Built with `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </div>
      <button
        onClick={() => {
          window.location.href = github;
        }}
      >
        Github
      </button>
    </footer>
  );
};
