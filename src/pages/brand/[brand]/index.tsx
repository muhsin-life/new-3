import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ProductListingPage } from "@/components/ProductPageListing";
import { useBrandProductListing } from "@/components/hooks/useData";
import getBrandProductListing from "@/helpers/api/getBrandProductListing";
import { BrandProListingProps } from "@/types/brand-product-listing";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { stringify } from "querystring";
import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface PageProps {
  brand: string;
  filterQueryString: string;
}

export default function BrandProductsListing({
  brand,
  filterQueryString,
}: PageProps) {
  const router = useRouter();

  const [query, setQuery] = useState(filterQueryString);
  const [isLoading, setLoading] = useState(false);

  const { data, refetch } = useBrandProductListing(
    brand,
    router.locale as locale,
    query
  );

  const fetchUpdatedData = useDebouncedCallback(() => {
    refetch().then((res) => {
      setLoading(false);
    });
  }, 500);

  useEffect(() => {
    const handleRouteChange = () => {
      fetchUpdatedData();
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [query]);

  const brandProData = data?.data;

  const onSortChange = (type: string, slug: string) => {
    setLoading(true);

    setQuery(stringify({ ...router.query, [type]: slug }));
    router.push(
      {
        query: {
          ...router.query,
          [type]: slug,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <div>
      <MaxWidthWrapper>
        <div className="flex flex-col">
          <ProductListingPage
            pageType="brand"
            pageName={"Brand"}
            data={{
              products: brandProData?.products,
              categories: brandProData?.categories,
              breadCrumbs: {
                segments: [
                  {
                    title: "Home",
                    href: "/",
                  },
                  {
                    title: "Brands",
                    href: "/brands",
                  },
                  {
                    title: brandProData?.brand_details.name || "Brand",
                    href: "#",
                  },
                ],
              },
              imageBannerUrl: brandProData?.brand_details.images.banner,
              description: brandProData?.brand_details.short_description,
              heading: brandProData?.brand_details.name,
            }}
            onSortChange={onSortChange}
            isLoading={isLoading}
          />
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
  locale,
}) => {
  const queryClient = new QueryClient();

  const brand = params?.brand as string;

  await queryClient.fetchQuery({
    queryKey: ["get-brand-product-listing", brand],
    queryFn: async () => {
      const data = await getBrandProductListing({
        brand,
        filters: stringify(query),
        locale: locale as locale,
      });
      return data as BrandProListingProps;
    },
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      brand,
      filterQueryString: stringify(query),
    },
  };
};
