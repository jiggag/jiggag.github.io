import React from 'react';
import { graphql, PageProps } from 'gatsby';
import { Layout } from 'components/Layout';
import { Seo } from 'components/Seo';
import { MarkdownRemarkProps } from 'types';

const MarkdownRemark = function ({
  data: { markdownRemark: { frontmatter, html } },
}: PageProps<MarkdownRemarkProps<'slug' | 'date' | 'title'>>) {
  return (
    <Layout>
      <Seo title={frontmatter.title} />
      <div className="blog-post-container">
        <div className="blog-post">
          <div className="blog-post-header">
            <h1>{frontmatter.title}</h1>
            <h6>{frontmatter.date}</h6>
          </div>
          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default MarkdownRemark;

export const pageQuery = graphql`
    query($id: String!) {
        markdownRemark(id: { eq: $id }) {
            html
            frontmatter {
                slug
                date(formatString: "YYYY년 M월 D일")
                title
            }
        }
    }
`;
