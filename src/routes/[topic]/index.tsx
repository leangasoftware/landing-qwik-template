import {
  component$,
  createContext,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import SectionComments from "../../components/section-comments/section-comments";
import SectionCta from "../../components/section-cta/section-cta";
import SectionTopic from "../../components/section-topic/section-topic";
import SectionVideo from "../../components/section-video/section-video";
import Section from "../../components/section/section";
import { stateAwsData, stateNodeData } from "../../context/store";

export const currentCtx = createContext("node-ctx");

export default component$(() => {
  const location = useLocation();
  const { v: versionPage } = { v: "v1", ...location.query };
  const topic = location.params.topic || "node";

  const stateNode = useStore({ ...stateNodeData });

  const stateAws = useStore({ ...stateAwsData });

  const getState = (stateName: string, version: string) => {
    version = version.toLowerCase();
    if (stateName === "aws") return (stateAws as any)[version];
    if (stateName === "node") return (stateNode as any)[version];
    return (stateNode as any)[version];
  };

  useContextProvider(currentCtx, getState(topic, versionPage));

  const getValueFrom = (version: string, value: string, nameState: string) => {
    version = version.toLowerCase();
    const obj = getState(nameState, version) as any;
    return obj[value];
  };

  const renderTitle = (text: string) => {
    const wordsSplit = text.split(" ");
    return wordsSplit.map((word) => {
      if (word.includes("_"))
        return <span className="hight-light"> {word.replace("_", "")} </span>;
      if (!word.includes("_")) return ` ${word} `;
    });
  };

  return (
    <>
      {" "}
      <Section>
        <slot q:slot="title">
          {renderTitle(getValueFrom(versionPage, "title", topic))}
        </slot>
        <slot q:slot="text">
          {renderTitle(getValueFrom(versionPage, "subTitle", topic))}
        </slot>
      </Section>
      <SectionCta
        style={"color-a"}
        link={getValueFrom(versionPage, "link", topic)}
        secondText={"Garantía de reembolso de 30 días"}
      />
      <SectionVideo />
      <SectionTopic />
      <SectionCta
        style={"color-b"}
        text={getValueFrom(versionPage, "price", topic)}
        link={getValueFrom(versionPage, "link", topic)}
        secondText={getValueFrom(versionPage, "ctaText", topic)}
      />
      <SectionComments />
      <SectionCta
        style={"color-a"}
        link={getValueFrom(versionPage, "link", topic)}
        secondText={getValueFrom(versionPage, "ctaText", topic)}
      />
    </>
  );
});
