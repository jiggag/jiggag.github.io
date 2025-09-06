import * as React from 'react';
import { graphql, Link, PageProps } from 'gatsby';
import { Layout } from 'components/Layout';
import { Seo } from 'components/Seo';
import { AllMarkdownRemarkProps } from 'types';

const IndexPage = function ({
  data: {
    allMarkdownRemark: { edges },
  },
}: PageProps<AllMarkdownRemarkProps<'title' | 'slug' | 'published' | 'date'>>) {
  return (
    <Layout>
      <Seo title="Home" />
      <div className="home-container">
        {edges
          .filter(({ node }) => node.frontmatter.published)
          .map(
            ({
              node: {
                id,
                frontmatter: { title, slug, date },
              },
            }) => (
              <Link to={slug} key={id}>
                <div className="home-post-title">
                  {title}
                  <p>{date}</p>
                </div>
              </Link>
            ),
          )}
      </div>
    </Layout>
  );
};

export default IndexPage;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: [{ frontmatter: { date: DESC } }, { frontmatter: { title: DESC } }]) {
      edges {
        node {
          id
          frontmatter {
            slug
            title
            published
            date(formatString: "YYYY-MM-DD")
          }
        }
      }
    }
  }
`;
