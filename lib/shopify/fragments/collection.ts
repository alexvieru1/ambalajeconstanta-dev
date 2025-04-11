import seoFragment from "./seo";

export const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    handle
    title
    description
    image {
      url
      altText
      width
      height
    }
    seo {
      ...seo
    }
    updatedAt
  }
  ${seoFragment}
`;
