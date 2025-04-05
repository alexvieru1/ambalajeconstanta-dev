import { Menu, ShopifyMenuItem, ShopiMenuOperation } from "./types";
import { getMenuQuery } from "./queries/menu";
import { SHOPIFY_GRAPHQL_API_ENDPOINT, TAGS } from "../constants";
import { ensureStartsWith } from "../utils";
import { isShopifyError } from "../type-guards";

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

export const getMenu = async (handle: string): Promise<Menu[]> => {
  const res = await shopifyFetch<ShopiMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: { handle },
  });

  return (
    res.body?.data?.menu?.items?.map((item: ShopifyMenuItem) => ({
      title: item.title,
      path: item.url
        .replace(domain, "")
        .replace("/collections", "/search")
        .replace("/pages", ""),
      children:
        item.items?.map((child) => ({
          title: child.title,
          path: child.url
            .replace(domain, "")
            .replace("/collections", "/search")
            .replace("/pages", ""),
          description:
          child.title === "Toate"
          ? "Gama completă de ambalaje alimentare"
          : child.title === "Ambalaje"
          ? "Caserole, cutii, tăvi — aluminiu, carton, biodegradabile"
          : child.title === "Pahare"
          ? "Pahare pentru băuturi calde și reci — carton, plastic, eco"
          : child.title === "Tacamuri"
          ? "Furculițe, linguri, cuțite — unică folosință și seturi"
          : child.title === "Folii"
          ? "Folii alimentare: stretch, aluminiu, PVC, biodegradabile"
          : ""        
        })) || [],
    })) || []
  );
};
