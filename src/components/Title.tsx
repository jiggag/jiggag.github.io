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
    <Link to={to} className={`title ${className}`}>
      {children}
    </Link>
  );
};
