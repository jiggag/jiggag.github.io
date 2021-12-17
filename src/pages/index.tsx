import * as React from 'react';
import { graphql, Link } from 'gatsby';
import { Layout } from 'components/Layout';
import { Seo } from 'components/Seo';

const IndexPage = function ({
  data: {
    allMarkdownRemark: { edges },
  },
}: {
  data: {
    allMarkdownRemark: {
      edges: {
        node: {
          id: string;
          frontmatter: {
            title: string;
            slug: string;
            published: boolean;
            date: string;
          }
        }
      }[];
    };
  };
}) {
  return (
    <Layout>
      <Seo title="Home" />
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
