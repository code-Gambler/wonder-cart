import getBillboards from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import Billboard from "@/components/billboard";
import ProductsList from "@/components/product-list";
import Container from "@/components/ui/container";

export const revalidate = 0;
const HomePage = async () => {
  const billboard = await getBillboards("91fb2d2f-f6f1-4347-98a3-b662a236a0a3");
  const products = await getProducts({ isFeatured: true });
  return (
    <Container>
      <div className="pb-10 space-y-10">
        <Billboard data={billboard} />
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductsList title="Featured Products" items={products} />
        </div>
      </div>
    </Container>
  );
};

export default HomePage;
