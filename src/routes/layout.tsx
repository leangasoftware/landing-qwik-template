import { component$, Slot, useContextProvider } from "@builder.io/qwik";
import Footer from "../components/footer/footer";
import Menu from "../components/menu/menu";

export default component$(() => {
  return (
    <>
      <Menu />
      <Slot /> {/* <== This is where the route will be inserted */}
      <Footer />
    </>
  );
});
