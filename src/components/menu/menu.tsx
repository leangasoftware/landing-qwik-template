import { component$, useStore, useStylesScoped$ } from "@builder.io/qwik";
import menuStyle from "./menu.css";
export default component$(() => {
  useStylesScoped$(menuStyle);

  const state = useStore<{
    items: {
      name: string;
      link: string;
      icon: string;
      size: { w: string; h: string };
    }[];
    cta: { name: string; link: string };
  }>({
    items: [
      // {
      //   name: "Angular",
      //   link: "",
      //   icon: "https://ultimatecourses.com/assets/category/angular-2052c478f3fcf0adc1c1c5aad5a4d9fe46a896ccda52ee6b8383b687b0c61042.svg",
      // },
      {
        name: "Backend",
        link: "/node",
        icon: "/img/ts.svg",
        size: { w: "20px", h: "20px" },
      },
      {
        name: "Cloud AWS",
        link: "aws",
        icon: "/img/aws-ec2.svg",
        size: { w: "20px", h: "20px" },
      },
    ],
    cta: {
      name: "¿Quién soy?",
      link: "#section-video",
    },
  });

  const renderLink = state.items.map((item) => (
    <li>
      <a href={item.link}>
        <span>
          <img
            width={item.size.w}
            height={item.size.h}
            className="logo"
            src={item.icon}
            alt=""
          />
        </span>
        {item.name}
      </a>
    </li>
  ));

  const renderCta = (
    <li>
      <a href={state.cta.link}>{state.cta.name}</a>
    </li>
  );

  return (
    <div className="menu-wrapper">
      <div className="menu-section">
        <ul className="menu">{renderLink}</ul>
        <ul className="menu">{renderCta}</ul>
      </div>
    </div>
  );
});
