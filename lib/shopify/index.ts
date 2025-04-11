import {
  Collection,
  Connection,
  Image,
  Menu,
  Product,
  ShopifyCollection,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyMenuItem,
  ShopifyProduct,
  ShopifyProductsOperation,
  ShopiMenuOperation,
} from "./types";
import { getMenuQuery } from "./queries/menu";
import {
  HIDDEN_PRODUCT_TAG,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  TAGS,
} from "../constants";
import { ensureStartsWith } from "../utils";
import { isShopifyError } from "../type-guards";
import { getProductsQuery } from "./queries/product";
import {
  getCollectionProductsQuery,
  getCollectionsQuery,
} from "./queries/collection";

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : "";

const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

export const shopifyFetch = async <T>({
  cache = "force-cache",
  headers,
  query,
  tags,
  variables,
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> => {
  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
        "X-Shopify-Storefront-Access-Token": key,
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      ...(tags && { next: { tags } }),
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (error) {
    if (isShopifyError(error)) {
      throw {
        cause: error.cause?.toString() || "unknown",
        status: error.status || 500,
        message: error.message,
        query,
      };
    }

    throw {
      error,
      query,
    };
  }
};

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattend = removeEdgesAndNodes(images);

  return flattend.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];

    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    };
  });
};

const reshapeProduct = (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true
) => {
  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants),
  };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

const slugify = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/\s+/g, "-") // spaces to hyphens
    .replace(/[^\w\\-]+/g, "") // remove special chars
    .toLowerCase();

export const getMenu = async (handle: string): Promise<Menu[]> => {
  const res = await shopifyFetch<ShopiMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: { handle },
  });

  const buildMenu = (items: ShopifyMenuItem[], parentSlug = ""): Menu[] => {
    return items.map((item) => {
      const cleanURL = item.url.replace(domain, "");

      let currentSlug = "";

      if (cleanURL === "/") {
        currentSlug = ""; // Home page should not have slug
      } else if (cleanURL.includes("/collections/")) {
        const rawSlug = cleanURL.replace("/collections/", "").replace("/", "");

        // ✅ Special case for "Toate produsele" or empty slug
        if (
          item.title.toLowerCase().includes("toate produsele") ||
          rawSlug === ""
        ) {
          currentSlug = "";
        } else {
          currentSlug = slugify(rawSlug);
        }
      } else if (cleanURL.includes("/pages/")) {
        const rawSlug = cleanURL.replace("/pages/", "").replace("/", "");
        currentSlug = slugify(rawSlug);
      } else if (cleanURL.includes("/policies/")) {
        const rawSlug = cleanURL.replace("/policies/", "").replace("/", "");
        currentSlug = slugify(rawSlug);
      } else {
        currentSlug = slugify(item.title);
      }

      // ✅ Clean path construction (no duplicate slashes)
      const segments = [parentSlug, currentSlug].filter(Boolean); // remove empty segments
      const path = `/${segments.join("/")}`;

      return {
        title: item.title,
        path,
        children: item.items ? buildMenu(item.items, segments.join("/")) : [],
      };
    });
  };

  return res.body?.data?.menu?.items ? buildMenu(res.body.data.menu.items) : [];
};

export const getProduseMenu = async (): Promise<Menu[]> => {
  const [menuRes, collections] = await Promise.all([
    shopifyFetch<ShopiMenuOperation>({
      query: getMenuQuery,
      tags: [TAGS.collections],
      variables: { handle: "nextjs-produse-menu" },
    }),
    getCollections(), // ✅ Fetch collections to get images
  ]);

  const collectionsMap = new Map<string, Collection>();
  collections.forEach((collection) => {
    collectionsMap.set(collection.handle, collection);
  });

  const buildMenu = (items: ShopifyMenuItem[], parentSlug = ""): Menu[] => {
    return items.map((item) => {
      const cleanURL = item.url.replace(domain, "");
      const slug = slugify(cleanURL.replace("/collections/", "").replace("/", ""));
      const path = `/produse/${[parentSlug, slug].filter(Boolean).join("/")}`;

      const collection = collectionsMap.get(slug);

      return {
        title: item.title,
        path,
        image: collection?.image, // ✅ Attach image if exists
        children: item.items
          ? buildMenu(item.items, [parentSlug, slug].filter(Boolean).join("/"))
          : [],
      };
    });
  };

  return menuRes.body?.data?.menu?.items
    ? buildMenu(menuRes.body.data.menu.items)
    : [];
};

export const getProducts = async ({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> => {
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery, // ✅ Use the correct query
    tags: [TAGS.products],
    variables: {
      query,
      reverse,
      sortKey,
    },
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
};

const reshapeCollection = (
  collection: ShopifyCollection,
  basePath: string = "/produse"
): Collection | undefined => {
  if (!collection) return undefined;

  return {
    ...collection,
    path: `${basePath}/${collection.handle}`,
  };
};

export const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

export const getCollections = async (): Promise<Collection[]> => {
  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections],
  });

  const shopifyCollections = removeEdgesAndNodes(res?.body?.data?.collections);

  const collections = [
    {
      handle: "",
      title: "All",
      description: "All products",
      seo: {
        title: "All",
        description: "All products",
      },
      path: "/produse",
      updatedAt: new Date().toISOString(),
      image: undefined,
    },
    ...reshapeCollections(
      shopifyCollections.filter(
        (collection) => !collection.handle.startsWith("hidden")
      )
    ),
  ];

  return collections;
};

export const getCollectionProducts = async ({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> => {
  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey,
    },
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for \`${collection}\``);
    return [];
  }

  return reshapeProducts(
    removeEdgesAndNodes(res.body.data.collection.products)
  );
};
