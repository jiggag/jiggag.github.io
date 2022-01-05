import * as React from 'react';
import { ReactNode } from 'react';
import { Link } from 'gatsby';

interface TitleProps {
  to?: string;
  className?: string;
  children: ReactNode;
}

export const Title = function ({ to = '', className, children }: TitleProps) {
  return (
    <p
      className={className}
      style={{
        margin: 0,
        fontSize: '1.5rem',
      }}
    >
      <Link
        to={to}
        style={{
          color: 'white',
          textDecoration: 'none',
        }}
      >
        {children}
      </Link>
    </p>
  );
};
