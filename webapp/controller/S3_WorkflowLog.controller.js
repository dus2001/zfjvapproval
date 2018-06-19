sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"edu/weill/cornell/wbg/fjv/approve/model/formatter/Formatter"
], function(Controller, JSONModel, MessageToast, URLHelper, Formatter) {
	"use strict";
	return Controller.extend("edu.weill.cornell.wbg.fjv.approve.controller.S3_WorkflowLog", {
		formatter: Formatter,
		onInit: function() {},
		handleShowApprovers: function(oEvent) {
			var approvers = oEvent.getSource().data("approvers");
			var oApprvrMdl = new JSONModel(approvers);
			var oView = this.getView();
			oView.setModel(oApprvrMdl, "JVApprvrList");
			var oDialog = oView.byId("apprvrPopup");
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(oView.getId(), "edu.weill.cornell.wbg.fjv.approve.view.ApproverPopup", this);
				oView.addDependent(oDialog);
			}
			oDialog.open();
		},
		sendEmailToAll: function() {
			var approversJSON = this.getView().getModel("JVApprvrList");
			var odata = approversJSON.getProperty("/results");
			if (odata instanceof Array) {
				var email = "";
				$.each(odata, function(i, o) {
					var eeemail = o.Email;
					if (eeemail.trim().length > 0) {
						if (email.length > 0) {
							email = email + ";";
						}
						email = email + eeemail;
					}
				});
				if (email.trim().length > 0) {
					sap.m.URLHelper.triggerEmail(email, "Info", "Dear ");
				}

			}
		},
		sendEmail: function(oEvent) {
			var email = oEvent.getSource().data("email");
			if (email.trim().length > 0) {
				sap.m.URLHelper.triggerEmail(email, "Info", "Dear ");
			}
		},
		onCloseDialog: function() {
			this.getView().byId("apprvrPopup").close();
		}
	});
});