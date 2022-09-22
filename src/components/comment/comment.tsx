import { component$, useStylesScoped$ } from "@builder.io/qwik";
import commentStyle from "./comment.css?inline";
export default component$(
  ({ text, author, vote }: { text: string; author: string; vote: number }) => {
    useStylesScoped$(commentStyle);

    const renderStar = (vote: number) => {
      return Array.from(Array(vote).keys()).map(() => (
        <span>
          <img
            width={"16px"}
            height={"19px"}
            src="/img/star.svg"
            alt="Puntuacion 5"
          />
        </span>
      ));
    };
    return (
      <div className="comment">
        <span class="quote"></span>
        <div class="comment-wrapper">
          <div className="starts">{renderStar(vote)}</div>
          <span className="comment-text">{text}</span>
          <span>{author}</span>
        </div>
      </div>
    );
  }
);
