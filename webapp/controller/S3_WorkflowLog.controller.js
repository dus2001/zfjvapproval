sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"edu/weill/cornell/wbg/fjv/approve/model/formatter/Formatter"
], function(Controller, MessageToast, Formatter) {
	"use strict";
	return Controller.extend("edu.weill.cornell.wbg.fjv.approve.controller.S3_WorkflowLog", {
		formatter: Formatter,
		onInit: function() {},
		handleShowApprovers: function() {
			MessageToast.show("Clicked");
		}
	});
});