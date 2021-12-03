import React, { ReactNode } from 'react';
import { OutboundLink } from 'gatsby-plugin-google-analytics';

interface GAProps {
  children: ReactNode;
}

export const GoogleAnalytics = function ({ children }: GAProps) {
  return (
    <OutboundLink href="https://www.gatsbyjs.com/plugins/gatsby-plugin-google-analytics/">
      {children}
    </OutboundLink>
  );
};
