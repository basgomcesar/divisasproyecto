/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your application specific code will go here
 */
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
], function (Context, ResponsiveUtils, ResponsiveKnockoutUtils, ko) {
  function ControllerViewModel() {
    var self = this;
    self.var_tipo = ko.observable("1");
    self.var_importe = ko.observable(0.0);
    self.var_resultado = ko.observable(0.0);
    self.actionConvertir = function () {
      var importe= parseFloat(self.var_importe());
      // Validar que el importe sea un número y que no sea nullo
      if (!isNaN(importe) && importe > 0) {
        if(self.var_tipo() === "1") {
          // Convertir de Dólares a Euros
          self.var_resultado((importe * 19.5).toFixed(2));
        }else if(self.var_tipo() === "2") {
          // Convertir de Euros a Dólares
          self.var_resultado((importe / 19.5).toFixed(2));
        } else {
          alert("Por favor, seleccione un tipo de conversión válido.");
          return;
        }
      } else {
        alert("Por favor, ingrese un importe válido.");
        return;
      }
    };
    // Media queries for responsive layouts
    const smQuery = ResponsiveUtils.getFrameworkQuery(
      ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY
    );
    this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

    // Header
    // Application Name used in Branding Area
    this.appName = ko.observable("App Name");
    // User Info used in Global Navigation area
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
      {
        name: "Your Privacy Rights",
        id: "yourPrivacyRights",
        linkTarget: "http://www.oracle.com/us/legal/privacy/index.html",
      },
    ];
  }

  // release the application bootstrap busy state
  Context.getPageContext().getBusyContext().applicationBootstrapComplete();

  return new ControllerViewModel();
});
