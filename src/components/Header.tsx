import * as React from 'react';
import { Title } from 'components/Title';

interface HeaderProps {
  siteTitle: string;
}

export const Header = function ({ siteTitle }: HeaderProps) {
  return (
    <header
      className="title-bar"
      style={{
        padding: '0.5rem 1rem',
      }}
    >
      <Title to="/" className="title-bar-text">
        {siteTitle}
      </Title>
      <div className="title-bar-controls">
        <button aria-label="Close" style={{
          width: 20,
          height: 19,
          backgroundPosition: 'top 5px left 5px',
        }} onClick={() => {
          window.history.back();
        }}/>
      </div>
    </header>
  );
};
