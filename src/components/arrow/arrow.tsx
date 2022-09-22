import {
  component$,
  useClientEffect$,
  useStore,
  useStylesScoped$,
} from "@builder.io/qwik";

import arrowStyle from "./arrow.css";

export default component$(() => {
  useStylesScoped$(arrowStyle);
  const state = useStore({
    flag: false,
  });

  useClientEffect$(() => {
    setInterval(() => {
      console.log("s", state.flag);
      state.flag = !state.flag;
    }, 1000);
  });

  return (
    <div class="example-wrapper">
      <div class={state.flag ? "arrow-example -hidden" : "arrow-example"}>
        <div class="dot -center"></div>
        <div class="dot -center"></div>
        <div class="dot -center"></div>
        <div class="dot -center"></div>
        <div class="dot -center"></div>
        <div class="dot -center"></div>
        <div class="dot -left-1"></div>
        <div class="dot -left-2"></div>
        <div class="dot -right-1"></div>
        <div class="dot -right-2"></div>
      </div>
    </div>
  );
});
