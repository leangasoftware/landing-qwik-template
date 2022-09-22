import { component$, useContext, useStylesScoped$ } from "@builder.io/qwik";
import { currentCtx } from "../../routes/[topic]";
import Comment from "../comment/comment";

import sectionComponentStyle from "./section-comments.css?inline";

export default component$(() => {
  useStylesScoped$(sectionComponentStyle);
  const state = useContext(currentCtx) as any;
  const comments = state.comments || [];

  const renderComments = comments.map(({ author, vote, text }: any) => (
    <Comment author={author} vote={vote} text={text} />
  ));

  return (
    <section className="section" id="section-comment">
      <div className="section-wrapper">
        <h1>Opiniones</h1>
        <div className="section-comment">{renderComments}</div>
      </div>
    </section>
  );
});
