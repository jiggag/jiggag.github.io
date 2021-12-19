import * as React from 'react';
import { Title } from 'components/Title';

interface HeaderProps {
  siteTitle: string;
}

export const Header = function ({ siteTitle }: HeaderProps) {
  return (
    <header
      style={{
        background: '#050A5F',
        padding: '0.5rem 1rem',
      }}
    >
      <Title to="/">
        {siteTitle}
      </Title>
    </header>
  );
};
