import { createContext } from "@builder.io/qwik";

export type GLOBAL_CONTEXT = {
  v: string;
  angular: {
    v1: {
      title: string;
      subTitle: string;
      ctaTitle: string;
      ctaButtonName: string;
    };
    v2: {
      title: string;
      subTitle: string;
      ctaTitle: string;
      ctaButtonName: string;
    };
  };
};

export const globalContex = createContext<GLOBAL_CONTEXT>("global.context");
