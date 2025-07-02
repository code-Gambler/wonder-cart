import Link from "next/link";

import MainNav from "@/components/main-nav";
import Container from "@/components/ui/container";
import getCategories from "@/actions/get-categories";
import NavbarActions from "./navbar-actions";
import getStoreName from "@/actions/get-name";

const Navbar = async () => {
  // let categories;
  // let store = { name: "Store" };
  // try {
  //   const response = await getCategories();

  //   // Check if the response is valid JSON
  //   if (response.headers['content-type'].includes('application/json')) {
  //     categories = await response;
  //   } else {
  //     throw new Error('Expected JSON, but got ' + response.headers['content-type']);
  //   }
  // } catch (error) {
  //   console.error('Error fetching categories:', error);

  //   // Optionally, log more detailed info if it's an HTML response
  //   if (error.response) {
  //     const errorText = await error.response.text();  // Get the body of the HTML error page
  //     console.error('Error response body:', errorText);
  //   }
  // }
  // try {
  //   const response = await getStoreName();

  //   // Check if the response is valid JSON
  //   if (response.headers['content-type'].includes('application/json')) {
  //     store = await response;
  //   } else {
  //     throw new Error('Expected JSON, but got ' + response.headers['content-type']);
  //   }
  // } catch (error) {
  //   console.error('Error fetching categories:', error);

  //   // Optionally, log more detailed info if it's an HTML response
  //   if (error.response) {
  //     const errorText = await error.response.text();  // Get the body of the HTML error page
  //     console.error('Error response body:', errorText);
  //   }
  // }
  const store = await getStoreName();
  const categories = await getCategories();
  console.log(categories)
  

  return (
    <div className="border-b">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
            <p className="font-bold text-xl">{store.name}</p>
          </Link>
          <MainNav data={categories} />
          <NavbarActions />
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
