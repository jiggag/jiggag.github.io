import React from 'react';
import { graphql, PageProps } from 'gatsby';
import { Layout } from 'components/Layout';
import { Seo } from 'components/Seo';
import { MarkdownRemarkProps } from 'types';

const MarkdownRemark = function ({
  data: {
    markdownRemark: {
      frontmatter: { tags, subtitle, title, date },
      html,
    },
  },
}: PageProps<MarkdownRemarkProps<'slug' | 'date' | 'title' | 'tags' | 'subtitle'>>) {
  return (
    <Layout>
      <Seo title={title} keywords={tags.join(', ')} description={subtitle} />
      <div className="blog-post-container">
        <div className="blog-post-header">
          <h3>{title}</h3>
          <h6>{date}</h6>
        </div>
        <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </Layout>
  );
};

export default MarkdownRemark;

export const pageQuery = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        slug
        date(formatString: "YYYY년 M월 D일")
        title
        subtitle
        tags
      }
    }
  }
`;
