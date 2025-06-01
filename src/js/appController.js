define([
  "ojs/ojcontext",
  "ojs/ojresponsiveutils",
  "ojs/ojresponsiveknockoututils",
  "knockout",
  "ojs/ojknockout",
  "ojs/ojformlayout",
  "ojs/ojlabel",
  "ojs/ojselectcombobox",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojcollapsible",
], function (Context, ResponsiveUtils, ResponsiveKnockoutUtils, ko) {
  class ControllerViewModel {
    constructor() {
      this.var_tipo = ko.observable("1");
      this.var_importe = ko.observable(0.0);
      this.var_resultado = ko.observable(0.0);
      this.var_rates = {};

      this.cbx_monedas = ko.observableArray([]);
      this.cbx_de = ko.observable("MXN");
      this.cbx_a = ko.observable("USD");
      this.var_importe2 = ko.observable(0.0);
      this.var_resultado2 = ko.observable(0.0);
      this.columns = ko.observable(2);
      this.actionConvertir = () => {
        const importe = parseFloat(this.var_importe());
        const tasa = parseFloat(this.var_rates["MXN"] || 0);
        if (!isNaN(importe) && importe > 0.0 && !isNaN(tasa) && tasa > 0.0) {
          if (this.var_tipo() === "1") {
            this.var_resultado(importe * tasa);
          } else {
            this.var_resultado(importe / tasa);
          }
        }
      };

      this.actionIntercambiar = () => {
        const temp = this.cbx_de();
        this.cbx_de(this.cbx_a());
        this.cbx_a(temp);
      };

      this.actionConvertir2 = () => {
        const importe = parseFloat(this.var_importe2());
        const tasa1 = parseFloat(this.var_rates[this.cbx_de()] || 0);
        const tasa2 = parseFloat(this.var_rates[this.cbx_a()] || 0);
        if (
          !isNaN(importe) &&
          importe > 0.0 &&
          !isNaN(tasa1) &&
          tasa1 > 0.0 &&
          !isNaN(tasa2) &&
          tasa2 > 0.0
        ) {
          let conversion = importe / tasa1;
          conversion = conversion * tasa2;
          this.var_resultado2(conversion);
        }
      };

      // Llamadas a servicios al cargar
      $(document).ready(() => {
        this.consultarDivisasWS();
        this.consultarCatalogoDivisasWS();
      });

      // Media queries
      const smQuery = ResponsiveUtils.getFrameworkQuery(
        ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY
      );
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

      // Branding / Header
      this.appName = ko.observable("App Name");
      this.userLogin = ko.observable("john.hancock@oracle.com");

      // Footer
      this.footerLinks = [
        {
          name: "About Oracle",
          linkId: "aboutOracle",
          linkTarget: "http://www.oracle.com/us/corporate/index.html#menu-about",
        },
        {
          name: "Contact Us",
          id: "contactUs",
          linkTarget: "http://www.oracle.com/us/corporate/contact/index.html",
        },
        {
          name: "Legal Notices",
          id: "legalNotices",
          linkTarget: "http://www.oracle.com/us/legal/index.html",
        },
        {
          name: "Terms Of Use",
          id: "termsOfUse",
          linkTarget: "http://www.oracle.com/us/legal/terms/index.html",
        },
      ];
    }

    consultarDivisasWS() {
      const request = new XMLHttpRequest();
      request.open(
        "GET",
        "https://openexchangerates.org/api/latest.json?app_id=e77f99c02f404d34a3631b67223d85e5",
        true
      );
      request.timeout = 6000;
      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          const data = JSON.parse(request.response);
          console.log("Rates:", data);
          this.var_rates = data.rates;
        } else {
          alert("No se puede conectar al servidor...");
        }
      };
      request.ontimeout = () => {
        alert("El servicio no se encuentra disponible en este momento...");
      };
      request.send();
    }

    consultarCatalogoDivisasWS() {
      const request = new XMLHttpRequest();
      request.open(
        "GET",
        "https://openexchangerates.org/api/currencies.json?app_id=e77f99c02f404d34a3631b67223d85e5",
        true
      );
      request.timeout = 6000;
      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          const data = JSON.parse(request.response);
          console.log("Monedas:", data);
          const monedas = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              monedas.push({ value: key, label: data[key] });
            }
          }
          this.cbx_monedas(monedas);
        } else {
          alert("No se puede conectar al servidor...");
        }
      };
      request.ontimeout = () => {
        alert("El servicio no se encuentra disponible en este momento...");
      };
      request.send();
    }
  }

  Context.getPageContext().getBusyContext().applicationBootstrapComplete();
  return new ControllerViewModel();
});
