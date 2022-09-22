import {
  component$,
  useContext,
  useStyles$,
  useStylesScoped$,
} from "@builder.io/qwik";
import { currentCtx } from "../../routes/[topic]";
import Card from "../card/card";

import sectionTopic from "./section-topic.css?inline";

export default component$(() => {
  useStylesScoped$(sectionTopic);
  const state = useContext(currentCtx) as any;
  const topic = state.topic || [];

  const renderTopics = topic.map((text: string) => <Card name={text} />);
  return (
    <section class="section">
      <div className="section-wrapper-topic">
        <h1>¿Qué aprenderás? </h1>
        {renderTopics}
        <div className="continue">
          <h3>Y mucho más...</h3>
        </div>
      </div>
    </section>
  );
});
