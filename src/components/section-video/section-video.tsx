import {
  component$,
  useStore,
  useStylesScoped$,
  useClientEffect$,
} from "@builder.io/qwik";
import Author from "../author/author";
import sectionStyle from "./section-video.css?inline";
export default component$(() => {
  useStylesScoped$(sectionStyle);
  const state = useStore({ load: false });

  useClientEffect$(() => {
    state.load = true;
    return () => null;
  });

  const renderVideo = (
    <div style="padding:56.25% 0 0 0;position:relative;">
      <iframe
        src="https://player.vimeo.com/video/750715054?h=a8ad677d76&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        style="position:absolute;top:0;left:0;width:100%;height:100%; background-image: url('/img/placeholder.avif')"
        title="cap-0 Introduccion.mp4"
      ></iframe>
    </div>
  );

  return (
    <section id="section-video" class={"section"}>
      <div class="section-video-wrapper">
        <div class="iframe-video">
          <div className="video-loading">
            {" "}
            {state.load ? renderVideo : <></>}
          </div>
        </div>
      </div>
      <Author />
    </section>
  );
});

export const SectionVideoStyle: { [key: string]: any } = {};
