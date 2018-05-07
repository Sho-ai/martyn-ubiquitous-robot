import React from "react";
import Helmet from "react-helmet";
import styled from "styled-components";
import PostListing from "../components/PostListing";
import config from "../../data/SiteConfig";
import PaginatedContent from "../components/PaginatedContent";
import PopularPosts from "../components/PopularPosts";
import CategoriesList from "../components/CategoriesList";
import Sidebar from "../components/Sidebar";
import TwoColumn from "../components/Layouts/TwoColumn";
import Box from "../components/Box";
import SubscribeForm from "../components/SubscribeForm";
import About from "../components/About";
import SocialFollow from "../components/SocialFollow";
import SubSidebar from "../components/SubSidebar";
import { fontsize } from "../tokens/dimensions";

const Heading = styled.h1`
  font-size: ${fontsize.xxl};
  text-align: center;
  color: ${props => props.color};
`;

class TagTemplate extends React.Component {
  render() {
    const {
      tag,
      nodes,
      page,
      pages,
      total,
      limit,
      prev,
      next,
      locale
    } = this.props.pathContext;
    const authorsEdges = this.props.data.authors.edges;
    const popularPosts = this.props.data.popularPosts.edges;
    const categories = this.props.data.categories.edges;
    const { category } = this.props.data;

    const pageTitle = category
      ? `Posts categorised with "${category.displayName}"`
      : `Posts tagged as "${tag}"`;

    const pageTitleColor = category && category.color;
    return (
      <TwoColumn>
        <Helmet title={`${pageTitle} | ${config.siteTitle}`}>
          <html lang={locale} />
        </Helmet>
        <div>
          <Heading color={pageTitleColor}>
            {(category && category.displayName) || tag}
          </Heading>
          <PaginatedContent
            page={page}
            pages={pages}
            total={total}
            limit={limit}
            prev={prev}
            next={next}
          >
            {/* PostListing component renders all the posts */}
            <PostListing postEdges={nodes} postAuthors={authorsEdges} />
          </PaginatedContent>
        </div>
        <Sidebar>
          <Box>
            <SubscribeForm locale={locale} formId="form-subscribe" />
          </Box>
          <Box>
            <SubscribeForm
              locale={locale}
              whitepaper
              formId="form-subscribe-whitepaper"
            />
          </Box>
          <Box>
            <SubSidebar>
              <About />
              <PopularPosts popularPosts={popularPosts} locale={locale} />
              <CategoriesList categories={categories} locale={locale} />
              <SocialFollow />
            </SubSidebar>
          </Box>
        </Sidebar>
      </TwoColumn>
    );
  }
}

/* eslint no-undef: "off" */
export const tagPageQuery = graphql`
  query TagPage($locale: String!, $category: String) {
    authors: allAuthorsJson {
      edges {
        node {
          title
          displayName
        }
      }
    }
    popularPosts: allMarkdownRemark(
      limit: 4
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { isPopular: { eq: true }, locale: { eq: $locale } }
      }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            locale
            localDate: date(locale: $locale, formatString: "DD MMMM YYYY")
            date
          }
          fields {
            slug
          }
        }
      }
    }
    category: categoriesJson(
      title: { eq: $category }
      locale: { eq: $locale }
    ) {
      displayName
      color
    }
    categories: allCategoriesJson(filter: { locale: { eq: $locale } }) {
      edges {
        node {
          title
          displayName
          color
        }
      }
    }
  }
`;

export default TagTemplate;
