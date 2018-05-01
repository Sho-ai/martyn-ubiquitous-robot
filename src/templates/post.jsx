import React from "react";
import { Helmet } from "react-helmet";
import _ from "lodash";
import Link from "gatsby-link";
import styled from "styled-components";
import config from "../../data/SiteConfig";
import PostDate from "../components/PostDate";
import PostTags from "../components/PostTags";
import AuthorModel from "../models/author-model";
import CategoryModel from "../models/category-model";
import SingleColumn from "../components/Layouts/SingleColumn";
import Box from "../components/Box/index";
import SubscribeForm from "../components/SubscribeForm/index";
import media from "../tokens/breakpoints";

const SubscribeWrapper = styled.div`
  display: grid;
  grid-gap: 24px;

  @media (${media.md}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  text-align: center;

  @media (${media.sm}) {
    font-size: 48px;
  }

  @media (${media.md}) {
    font-size: 64px;
  }
`;

class PostTemplate extends React.Component {
  render() {
    const postNode = this.props.data.markdownRemark;
    const {
      locale,
      title,
      date,
      tags,
      category,
      author
    } = postNode.frontmatter;

    const authorData = AuthorModel.getAuthor(
      this.props.data.authors.edges,
      author,
      config.blogAuthorId
    );

    const categoryData = CategoryModel.getCategory(
      this.props.data.categories.edges,
      _.kebabCase(category),
      config.blogAuthorId
    );

    return (
      <SingleColumn>
        <Helmet title={`${title} | ${config.siteTitle}`}>
          <html lang={locale} />
        </Helmet>
        <article>
          <header>
            <Title>{title}</Title>
            <Link to={`/${locale}/categories/${_.kebabCase(category)}`}>
              <span style={{ color: categoryData.color }}>{category}</span>
            </Link>
            <PostDate date={date} />
          </header>

          <section dangerouslySetInnerHTML={{ __html: postNode.html }} />

          <footer>
            <SubscribeWrapper>
              <Box>
                <SubscribeForm locale={locale} whitepaper />
              </Box>
              <Box>
                <SubscribeForm locale={locale} />
              </Box>
            </SubscribeWrapper>
            <PostTags prefix="Tags" tags={tags} locale={locale} />
            <p>{authorData.name}</p>
          </footer>
        </article>
      </SingleColumn>
    );
  }
}

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      excerpt
      frontmatter {
        title
        date
        category
        tags
        author
        locale
      }
      fields {
        slug
      }
    }
    # authors
    authors: allAuthorsJson {
      edges {
        node {
          id
          name
        }
      }
    }
    categories: allCategoriesJson {
      edges {
        node {
          id
          color
        }
      }
    }
  }
`;

export default PostTemplate;
