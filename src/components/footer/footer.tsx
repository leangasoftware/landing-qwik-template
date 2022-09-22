import { component$, useStylesScoped$ } from "@builder.io/qwik";

import footerStyle from "./footer.css?inline";

export default component$(() => {
  useStylesScoped$(footerStyle);
  return (
    <div className="footer">
      <div className="section-wrapper-footer">
        <div className="footer-logo">
          <div>
            <img width={"92px"} height={"30px"} src="/img/visa.svg" alt="" />
          </div>
          <div>
            <img width={"112px"} height={"30px"} src="/img/paypal.svg" alt="" />
          </div>
        </div>
        <div>Garantía de reembolso de 30 días</div>
      </div>
    </div>
  );
});
