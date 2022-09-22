import { component$, useStylesScoped$ } from "@builder.io/qwik";
import sectionCtaStyle from "./section-cta.css";
export default component$(
  ({
    text,
    secondText,
    link,
    style = "",
  }: {
    text?: string;
    secondText?: string;
    link?: string;
    style: "color-a" | "color-b" | "";
  }) => {
    useStylesScoped$(sectionCtaStyle);
    return (
      <section>
        <div className="sction-cta-wrapper">
          <div>
            <a
              target={"_blank"}
              className={`link-cta link-` + style}
              href={link}
            >
              Empieza YA! {text ? text : ""}
            </a>
            {secondText ? (
              <div className="text-small">
                <small>{secondText}</small>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </section>
    );
  }
);
