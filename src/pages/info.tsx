import React, {FunctionComponent} from 'react'
import {graphql} from 'gatsby'
import Text from '../components/Text'
import { Link } from 'gatsby'

type InfoPageProps = {
    data: {
        site: {
            siteMetadata: {
                title: string
                description: string
                author: string
            }
        }
    }
}

const InfoPage: FunctionComponent<InfoPageProps> = function ({
                                                                 data: {
                                                                     site: {
                                                                         siteMetadata: {title, description, author},
                                                                     },
                                                                 },
                                                             }) {
    return (
        <div>
            <Text text={title}/>
            <Text text={description}/>
            <Text text={author}/>
            <Link to="/">To Main</Link>
        </div>
    )
}

export default InfoPage

export const metadataQuery = graphql`
  {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`;