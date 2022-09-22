import { component$, useContextProvider } from "@builder.io/qwik";
import { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler<any> = async ({ request, response }) => {
  const { url } = request;
  if (url.includes("node")) {
    throw response.redirect("/node");
  }
  if (url.includes("aws")) {
    console.log(url);
    throw response.redirect("/aws");
  }

  throw response.redirect("/node");
};

export default component$(() => {
  return <></>;
});
