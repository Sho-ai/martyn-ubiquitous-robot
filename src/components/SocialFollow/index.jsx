import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { hideVisually } from 'polished'
import config from '../../../data/SiteConfig'
import { FacebookIcon, TwitterIcon, LinkedinIcon, InstagramIcon } from '../SocialIcons'
import spacing, { fontsize } from '../../tokens/dimensions'

const Title = styled.h2`
  margin: 0;
  font-size: ${fontsize.base};
`

export const List = styled.dl`
  display: flex;
  justify-content: flex-start;
`

export const DefinitionTitle = styled.dt`
  ${hideVisually};
`

export const DefinitionData = styled.dd`
  margin: 0 ${spacing.base} 0 0;
`

export const Link = styled.a`
  display: block;
  max-width: ${spacing.xl};
`

export const DisplayName = styled.span`
  ${hideVisually};
`

const SocialItem = ({ url, providerDisplayName, profileDisplayName, providerName }) => {
  const icons = {
    facebook: <FacebookIcon />,
    twitter: <TwitterIcon />,
    instagram: <InstagramIcon />,
    linkedin: <LinkedinIcon />,
  }
  return (
    <Fragment>
      <DefinitionTitle>{providerDisplayName}</DefinitionTitle>
      <DefinitionData>
        <Link href={url} providerName={providerName}>
          {icons[providerName]}
          <DisplayName>{profileDisplayName}</DisplayName>
        </Link>
      </DefinitionData>
    </Fragment>
  )
}

const SocialFollow = () => (
  <div>
    <Title>
      <FormattedMessage id="sidebar.socialMedia.heading" />
    </Title>
    <List>{config.social.map(profile => <SocialItem key={profile.providerName} {...profile} />)}</List>
  </div>
)

export default SocialFollow
