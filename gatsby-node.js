const path = require("path");
const _ = require("lodash");
const fs = require("fs");
const webpackLodashPlugin = require("lodash-webpack-plugin");
const siteConfig = require("./data/SiteConfig");
const {
  createPaginationPages,
  prefixPathFormatter
} = require("gatsby-pagination");

exports.onCreateNode = ({ node, boundActionCreators, getNode, getNodes }) => {
  const { createNodeField, createParentChildLink } = boundActionCreators;
  let slug;
  if (node.internal.type === "MarkdownRemark") {
    const fileNode = getNode(node.parent);
    const parsedFilePath = path.parse(fileNode.relativePath);
    if (
      Object.prototype.hasOwnProperty.call(node, "frontmatter") &&
      Object.prototype.hasOwnProperty.call(node.frontmatter, "slug")
    ) {
      slug = `/${_.kebabCase(node.frontmatter.slug)}`;
    } else if (
      Object.prototype.hasOwnProperty.call(node, "frontmatter") &&
      Object.prototype.hasOwnProperty.call(node.frontmatter, "title")
    ) {
      slug = `/${_.kebabCase(node.frontmatter.title)}`;
    } else if (parsedFilePath.name !== "index" && parsedFilePath.dir !== "") {
      slug = `/${parsedFilePath.dir}/${parsedFilePath.name}/`;
    } else if (parsedFilePath.dir === "") {
      slug = `/${parsedFilePath.name}/`;
    } else {
      slug = `/${parsedFilePath.dir}/`;
    }
    createNodeField({ node, name: "slug", value: slug });

    // Attach image's ImageSharp node by public path if necessary
    if (node.frontmatter.image && typeof node.frontmatter.image === "string") {
      // Find absolute path of linked path
      const pathToFile = path
        .join(__dirname, "static", node.frontmatter.image)
        .split(path.sep)
        .join("/");

      console.log(`Path to file: ${pathToFile}`);
      // Find ID of File node
      const fileImageNode = getNodes().find(n => n.absolutePath === pathToFile);
      console.log(`File image node: ${fileImageNode}`);

      if (fileImageNode != null) {
        // Find ImageSharp node corresponding to the File node
        const imageSharpNodeId = fileImageNode.children.find(n =>
          n.endsWith(">> ImageSharp")
        );
        const imageSharpNode = getNodes().find(n => n.id === imageSharpNodeId);

        // Add ImageSharp node as child
        createParentChildLink({ parent: node, child: imageSharpNode });
      }
    }
  }
};

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    const indexPage = path.resolve("src/templates/index.jsx");
    const postPage = path.resolve("src/templates/post.jsx");
    const tagPage = path.resolve("src/templates/tag.jsx");
    // const categoryPage = path.resolve("src/templates/category.jsx");
    // const authorPage = path.resolve("src/templates/author.jsx");

    if (!fs.existsSync(path.resolve(`content/${siteConfig.blogAuthorDir}/`))) {
      reject(
        "The 'authors' folder is missing within the 'blogAuthorDir' folder."
      );
    }

    resolve(
      graphql(
        `
          {
            allMarkdownRemark(
              limit: 1000
              sort: { fields: [frontmatter___date], order: DESC }
            ) {
              totalCount
              edges {
                node {
                  frontmatter {
                    title
                    tags
                    date
                    category
                    author
                    locale
                  }
                  fields {
                    slug
                  }
                  excerpt
                  timeToRead
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          /* eslint no-console: "off" */
          console.log(result.errors);
          reject(result.errors);
        }

        const posts = result.data.allMarkdownRemark.edges;

        siteConfig.locales.forEach(code => {
          const localePosts = posts.filter(
            post => post.node.frontmatter.locale === code
          );

          // Create Paginated Tag and Category Pages

          const tagSet = new Set();
          const tagMap = new Map();
          const categorySet = new Set();
          const authorSet = new Set();

          localePosts.forEach(edge => {
            if (edge.node.frontmatter.tags) {
              edge.node.frontmatter.tags.forEach(tag => {
                tagSet.add(tag);

                const array = tagMap.has(tag) ? tagMap.get(tag) : [];
                array.push(edge);
                tagMap.set(tag, array);
              });
            }

            if (edge.node.frontmatter.author) {
              authorSet.add(edge.node.frontmatter.author);
            }

            if (edge.node.frontmatter.category) {
              categorySet.add(edge.node.frontmatter.category);
            }

            // Creates Index page
            createPaginationPages({
              createPage,
              edges: localePosts,
              component: indexPage,
              pathFormatter: prefixPathFormatter(`/${code}`),
              limit: siteConfig.sitePaginationLimit + 1,
              context: {
                locale: code
              }
            });
          });

          const tagList = Array.from(tagSet);
          tagList.forEach(tag => {
            createPaginationPages({
              createPage,
              edges: tagMap.get(tag),
              component: tagPage,
              pathFormatter: prefixPathFormatter(
                `/${code}/tags/${_.kebabCase(tag)}`
              ),
              limit: siteConfig.sitePaginationLimit,
              context: {
                tag,
                locale: code
              }
            });
          });

          const categoryList = Array.from(categorySet);
          categoryList.forEach(category => {
            const categoryEdges = localePosts.filter(
              ({ node }) => node.frontmatter.category === category
            );
            createPaginationPages({
              createPage,
              edges: categoryEdges,
              component: tagPage,
              pathFormatter: prefixPathFormatter(
                `/${code}/categories/${_.kebabCase(category)}`
              ),
              limit: siteConfig.sitePaginationLimit,
              context: {
                category,
                locale: code
              }
            });
          });

          const authorList = Array.from(authorSet);
          authorList.forEach(author => {
            const authorEdges = localePosts.filter(
              ({ node }) => node.frontmatter.author === author
            );
            createPaginationPages({
              createPage,
              edges: authorEdges,
              component: tagPage,
              pathFormatter: prefixPathFormatter(
                `/${code}/authors/${_.kebabCase(author)}`
              ),
              limit: siteConfig.sitePaginationLimit,
              context: {
                author,
                locale: code
              }
            });
          });

          localePosts.forEach(({ node }) => {
            createPage({
              path: `${code}${node.fields.slug}`,
              component: postPage,
              context: {
                slug: `${node.fields.slug}`,
                locale: node.frontmatter.locale
              } // additional data can be passed via context
            });
          });
        });
      })
    );
  });
};

exports.modifyWebpackConfig = ({ config, stage }) => {
  if (stage === "build-javascript") {
    config.plugin("Lodash", webpackLodashPlugin, null);
  }
};
