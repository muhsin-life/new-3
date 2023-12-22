import { Product } from "@/types/products";
import { Sidebar } from "./Sidebar";
import { Category } from "@/types/categories";
import ProductListing from "./product/ProductListing";
import { ProductSliderSkeleton } from "./ProductSkeleton";
import Image from "next/image";
import { Breadcrumbs, BreadcrumbsProps } from "./BreadCrumb";
import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { LIST_VIEW_TYPES, SORT_BY_ITEMS } from "@/config";

interface ProductListingPageData {
  heading?: string;
  description?: string;
  imageBannerUrl: string | null | undefined;
  breadCrumbs: BreadcrumbsProps;
  products?: Product[] | undefined;
  categories: Category[] | undefined;
}

interface ProductListingPageProps {
  pageType: "brand" | "products" | "category";
  pageName: string | string[];
  data: ProductListingPageData;
  isLoading: boolean;
  onSortChange: (type: string, slug: string) => void;
}

const DEFAULT_IMAGE = "https://www.lifepharmacy.com/images/page-header-bg.jpg";

export const ProductListingPage = ({
  pageType,
  pageName,
  isLoading,
  data,
  onSortChange,
}: ProductListingPageProps) => {
  const {
    imageBannerUrl = DEFAULT_IMAGE,
    heading = "Products",
    breadCrumbs,
    description,
    products,
    categories,
  } = data;

  const [showMore, setShowMore] = useState(false);
  const [productsLength, setProductsLength] = useState(products?.length ?? 40);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col ">
        <div className="relative w-full">
          <Image
            src={imageBannerUrl ?? DEFAULT_IMAGE}
            height={500}
            width={1440}
            className="w-full object-cover h-[15rem] "
            alt={heading}
          />
          {imageBannerUrl === DEFAULT_IMAGE ? (
            <div className="absolute inset-0 flex items-center justify-center">
              {" "}
              <h4 className="text-3xl text-primary font-semibold mx-auto w-fit  h-fit">
                {heading}
              </h4>
            </div>
          ) : null}
        </div>
        <Breadcrumbs {...breadCrumbs} />
      </div>
      <div className="py-3  border-b border-muted">
        {description && !showMore && (description?.length ?? 0) > 400 ? (
          <div className="flex flex-col items-center gap-2">
            {" "}
            <p
              className="text-sm text-slate-700"
              dangerouslySetInnerHTML={{
                __html: description.substring(0, 400) + "..." || "",
              }}
            />
            <Button
              variant={"outline"}
              size={"sm"}
              className="h-7 rounded-xl text-xs"
              onClick={() => setShowMore(true)}
            >
              Show More
            </Button>
          </div>
        ) : (
          <p
            className="text-sm text-slate-700"
            dangerouslySetInnerHTML={{
              __html: description ?? "",
            }}
          />
        )}
      </div>
      <div className="flex justify-between py-5">
        <div className="grid gap-1">
          <h4 className="md:text-xl text-lg font-bold text-pink-700">
            {pageName} - {heading}
          </h4>
          <p className="text-muted-foreground text-sm">
            Showing{" "}
            <span className="text-slate-800">
              {productsLength} of {categories ? categories[0].count : "40"}
            </span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 ">
          <div className="grid gap-2 w-40">
            <Label htmlFor="sort_by">Sort By</Label>
            <Select
              defaultValue={SORT_BY_ITEMS[0].slug}
              onValueChange={(value) => onSortChange("order_by", value)}
            >
              <SelectTrigger id="sort_by">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {SORT_BY_ITEMS.map((item) => (
                  <SelectItem value={item.slug}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 w-40">
            <Label htmlFor="type">View By</Label>
            <Select
              defaultValue={LIST_VIEW_TYPES[0].slug}
              onValueChange={(value) => onSortChange("list", value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {LIST_VIEW_TYPES.map((item) => (
                  <SelectItem value={item.slug}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Sidebar
          className="col-span-3"
          brandCatData={data.categories}
          page_type={pageType}
        />

        <div className="grid grid-cols-4 gap-4 col-span-9 pb-5">
          {data.products
            ? isLoading
              ? Array(8).fill(<ProductSliderSkeleton />)
              : data?.products.map((product, i) => (
                  <ProductListing
                    key={`product-${i}`}
                    product={product}
                    index={i}
                  />
                ))
            : null}
        </div>
      </div>
    </div>
  );
};
