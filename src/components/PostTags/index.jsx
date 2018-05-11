import React, { Component } from "react";
import _ from "lodash";
import Link from "gatsby-link";
import { FormattedMessage, injectIntl } from "react-intl";
import styled from "styled-components";
import { ReactComponent as TagIcon } from "../../svg/tag.svg";
import spacing, { fontsize } from "../../tokens/dimensions";

const Container = styled.div`
  margin-top: ${spacing.xxl};
  text-align: center;
`;

const Heading = styled.h2`
  margin: 0 0 ${spacing.base};
  font-size: ${fontsize.md};
`;

const StyledTagIcon = styled(TagIcon)`
  width: 1em;
  height: 1em;
  margin-right: 0.5em;
  vertical-align: middle;
  fill: ${props => props.theme.palette.grisLight};
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.theme.palette.grisLight};
`;

class PostTags extends Component {
  render() {
    const { tags, intl } = this.props;
    const { locale } = intl;
    if (tags) {
      return (
        <Container>
          <Heading>
            <StyledTagIcon /><FormattedMessage id="post.tagsHeading" />
          </Heading>
          {tags.map((tag, index, arr) => (
            <span key={tag}>
              <StyledLink key={tag} to={`/${locale}/tags/${_.kebabCase(tag)}`}>
                {tag}
              </StyledLink>
              {index !== arr.length - 1 ? ", " : ""}
            </span>
          ))}
        </Container>
      );
    }
    return null;
  }
}

export default injectIntl(PostTags);
