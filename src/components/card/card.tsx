import { component$, useStylesScoped$ } from "@builder.io/qwik";

import cardStyle from "./card.css?inline";

export default component$((props: { name: string }) => {
  useStylesScoped$(cardStyle);
  return (
    <div className="card">
      <div>
        <img
          src="/img/check-circle.svg"
          width={"19px"}
          height={"23px"}
          alt="ok"
        />{" "}
        {props.name}
      </div>
    </div>
  );
});
