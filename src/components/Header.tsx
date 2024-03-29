import * as React from 'react';
import { Title } from 'components/Title';

interface HeaderProps {
  siteTitle: string;
  isMaximize: boolean;
  toggleMaximize: () => void;
  onClose: () => void;
  onScrollToTop: () => void;
}

export const Header = function ({
  siteTitle, isMaximize, toggleMaximize, onClose, onScrollToTop,
}: HeaderProps) {
  return (
    <header className="title-bar">
      <Title to="/" className="title-bar-text">
        {siteTitle}
      </Title>
      <div className="title-bar-controls">
        <button
          type="button"
          aria-label="ScrollToTop"
          onClick={onScrollToTop}
        />
        <button
          type="button"
          aria-label={isMaximize ? 'Minimize' : 'Maximize'}
          onClick={toggleMaximize}
        />
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
        />
      </div>
    </header>
  );
};
