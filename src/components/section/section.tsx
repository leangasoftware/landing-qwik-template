import { component$, Slot, useStylesScoped$ } from "@builder.io/qwik";
import sectionStyle from "./section.css?inline";
export default component$(() => {
  useStylesScoped$(sectionStyle);
  return (
    <section id="section-main" class="section">
      <div className="section-wrapper">
        <h1 className="p-1-v">
          <Slot name="title" />
        </h1>
        <h3 className="p-1-v letter-space">
          <Slot name="text" />
        </h3>
      </div>
    </section>
  );
});

export const SectionStyle: { [key: string]: any } = {};
