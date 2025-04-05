export type Menu = {
    title: string,
    path: string,
    description?: string;
    children?: Menu[]
};

export type ShopifyMenuItem = {
    title: string;
    url: string;
    items?: ShopifyMenuItem[];
  };
  
export type ShopiMenuOperation = {
    data: {
        menu?: {
            items:{
                title:string;
                url: string;
            }[];
        }
    },
    variables: {
        handle: string;
    }
};