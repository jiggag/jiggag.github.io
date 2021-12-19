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
      <main style={{
        overflow: 'auto',
        flex: 1,
      }}
      >
        <div style={{
          background: '#f1ede7',
          padding: '0.5rem 1rem',
        }}
        >
          {edges.filter(({ node }) => node.frontmatter.published).map(({ node: { id, frontmatter: { title, slug, date } } }) => (
            <p
              key={id}
              style={{
                margin: 0,
              }}
            >
              <Link to={slug}>
                {title}
                /
                {date}
              </Link>
            </p>
          ))}
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;

export const pageQuery = graphql`
    query {
        allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
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
