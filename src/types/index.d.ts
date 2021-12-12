interface SiteMetadata {
  title: string;
  description: string;
  author: string;
  siteUrl: string;
}

export interface Site {
  site: {
    siteMetadata: SiteMetadata
  }
}
