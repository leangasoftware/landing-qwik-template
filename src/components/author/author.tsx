import { component$, useStylesScoped$ } from "@builder.io/qwik";
import authorStyle from "./author.css?inline";
export default component$(() => {
  useStylesScoped$(authorStyle);
  return (
    <div className="author-wrapper">
      <div className="author">
        <div className="author-image">
          <img
            width={"60px"}
            height={"60px"}
            src="/img/leifer.png"
            alt="Leifer Mendez"
          />
        </div>
        <div className="author-detail">
          <div>
            Soy Leifer Mendez un ferviente apasionado de la tecnología,
            ingeniero en informática con más de 10 años de experiencia en el
            mundo de la programación.
          </div>
        </div>
      </div>
    </div>
  );
});
