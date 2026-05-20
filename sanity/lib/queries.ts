import { groq } from 'next-sanity'

export const trailImagesQuery = groq`
  *[_type == "trailImage"] | order(order asc) {
    "url": image.asset->url,
  }
`

export const timelinePanelsQuery = groq`
  *[_type == "timelineEvent"] {
    eventKey,
    panelLayout,
    panelSize,
    "panelImages": panelImages[].asset->url,
  }
`
