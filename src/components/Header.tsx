import * as React from 'react';
import { Title } from 'components/Title';

interface HeaderProps {
  siteTitle: string;
}

export const Header = function ({ siteTitle }: HeaderProps) {
  return (
    <header
      className="title-bar"
    >
      <Title to="/" className="title-bar-text">
        {siteTitle}
      </Title>
      <div className="title-bar-controls">
        <button
          aria-label="Close"
          onClick={() => {
            window.history.back();
          }}
        />
      </div>
    </header>
  );
};
