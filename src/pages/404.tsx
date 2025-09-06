import * as React from 'react';
import { Layout } from 'components/Layout';
import { graphql, Link, PageProps } from 'gatsby';
import { Seo } from 'components/Seo';
import { AllMarkdownRemarkProps } from 'types';

const NotFoundPage = function ({
  data: {
    allMarkdownRemark: { edges },
  },
}: PageProps<AllMarkdownRemarkProps<'title' | 'slug' | 'published' | 'date'>>) {
  return (
    <Layout>
      <Seo title="404: Not found" />
      <div className="not-found-title">
        찾을 수 없는 페이지 입니다
        <p>- 잘못된 주소이거나</p>
        <p>- 해당 글이 사라졌나봐요</p>
      </div>

      <div className="not-found-title">
        최근 등록된 페이지를 확인해보세요!
        {edges.filter(({ node }) => node.frontmatter.published).splice(0, 10).map(({ node: { id, frontmatter: { title, slug, date } } }) => (
          <Link to={slug} key={id}>
            <p>- {title}</p>
          </Link>
        ))}
      </div>

    </Layout>
  );
};

export default NotFoundPage;

export const pageQuery = graphql`
    query {
        allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
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
