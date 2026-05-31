import { getBrands } from "@/lib/services/Products.service";
import Filters from "./Filters";

export default async function FiltersWrapper({ category }: { category?: string }) {
  const brandList = await getBrands(category);
  return <Filters brands={brandList} />;
}