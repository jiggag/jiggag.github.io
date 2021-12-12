import * as React from 'react';

interface FooterProps {
  author: string;
}

export const Footer = function ({ author }: FooterProps) {
  return (
    <footer
      style={{
        marginTop: '2rem',
      }}
    >
      {`${author}, Built with `}
      <a href="https://www.gatsbyjs.com">Gatsby</a>
    </footer>
  );
};
