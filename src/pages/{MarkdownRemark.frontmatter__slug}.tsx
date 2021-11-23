import React from 'react';
import { graphql } from 'gatsby';

interface MarkdownRemarkProps {
  data: {
    markdownRemark: {
      frontmatter: {
        slug: string;
        date: string;
        title: string;
      };
      html: string;
    }
  }
}

const MarkdownRemark = function ({
  data, // this prop will be injected by the GraphQL query below.
}: MarkdownRemarkProps) {
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark;
  return (
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
