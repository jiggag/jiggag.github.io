import * as React from 'react';

interface FooterProps {
  author: string;
  onPressGithub: () => void;
}

export const Footer = function ({ author, onPressGithub }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer-label">
        {`${author}, Built with `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </div>
      <button
        type="button"
        aria-label="Github"
        onClick={onPressGithub}
      >
        Github
      </button>
    </footer>
  );
};
