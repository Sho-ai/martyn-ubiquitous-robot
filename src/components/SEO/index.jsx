import React, { Component } from "react";
import Helmet from "react-helmet";
import config from "../../../data/SiteConfig";

class SEO extends Component {
  render() {
    const { postNode, postSEO, author } = this.props;
    let title;
    let description;
    let image;
    let postURL;
    let locale;
    let publishTime;
    if (postSEO) {
      const postMeta = postNode.frontmatter;
      ({ locale, title, date: publishTime } = postMeta);
      image = postNode.thumbnailArray[0].sizes.originalImg;
      description =
        postMeta.seo && postMeta.seo.description
          ? postMeta.seo.description
          : postNode.excerpt;
      postURL = `${config.siteUrl}/${postNode.frontmatter.locale}${
        postNode.fields.slug
      }`;
    } else {
      title = config.siteTitle;
      description = config.siteDescription;
      image = config.siteLogo;
    }
    image = config.siteUrl + image;
    const blogURL = config.siteUrl;
    const schemaOrgJSONLD = [
      {
        "@context": "http://schema.org",
        "@type": "WebSite",
        url: blogURL,
        name: config.siteTitle
      }
    ];
    if (postSEO) {
      schemaOrgJSONLD.push({
        "@context": "http://schema.org",
        "@type": "BlogPosting",
        mainEntityOfPage: {
          "@type": "WebSite",
          "@id": blogURL
        },
        url: postURL,
        name: title,
        author: author.displayName,
        headline: title,
        datePublished: publishTime,
        publisher: {
          "@type": "Organization",
          name: config.organizationName,
          logo: {
            "@type": "ImageObject",
            url: config.siteUrl + config.siteLogo
          }
        },
        image: {
          "@type": "ImageObject",
          url: image
        },
        description
      });
    }
    return (
      <Helmet>
        {/* General tags */}
        <meta name="description" content={description} />
        <meta name="image" content={image} />
        {postSEO && <meta name="author" content={author.displayName} />}
        {postSEO && <link rel="canonical" href={postURL} />}

        {/* Schema.org tags */}
        <script type="application/ld+json">
          {JSON.stringify(schemaOrgJSONLD)}
        </script>

        {/* OpenGraph tags */}
        <meta property="og:url" content={postSEO ? postURL : blogURL} />
        {postSEO ? (
          <meta property="og:type" content="article" />
        ) : (
          <meta property="og:type" content="website" />
        )}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content={config.siteTitle} />
        <meta property="og:locale" content={locale} />
        <meta property="og:image" content={image} />
        <meta
          property="fb:app_id"
          content={config.siteFBAppID ? config.siteFBAppID : ""}
        />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:creator"
          content={config.userTwitter ? config.userTwitter : ""}
        />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Helmet>
    );
  }
}

export default SEO;
