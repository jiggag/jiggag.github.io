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

interface Frontmatter {
  layout: 'post';
  title: string;
  subtitle: string;
  slug: string;
  published: boolean;
  date: string;
  tags: string[];
}

interface Node<Keys extends keyof Frontmatter> {
  id: string;
  html: string;
  frontmatter: Pick<Frontmatter, Keys>;
}

export interface AllMarkdownRemarkProps<Keys extends keyof Frontmatter> {
  allMarkdownRemark: {
    edges: Record<'node', Omit<Node<Keys>, 'html'>>[];
  }
}

export interface MarkdownRemarkProps<Keys extends keyof Frontmatter> {
  markdownRemark: Omit<Node<Keys>, 'id'>
}
