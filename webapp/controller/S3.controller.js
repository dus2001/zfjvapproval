sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/m/UploadCollectionParameter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/FileSizeFormat",
	"sap/m/MessageToast"
], function(jQuery, Controller, Fragment, UploadCollectionParameter, JSONModel, FileSizeFormat, MessageToast) {
	"use strict";
	return Controller.extend("edu.weill.cornell.wbg.fjv.approve.controller.S3", {
		onInit: function() {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			var Wiid = "000001289554";
			var compData = this.getOwnerComponent().getComponentData();
			if (compData) {
				if (compData.startupParameters) {
					var sparam = compData.startupParameters;
					var wiidparam = sparam.WIID;
					Wiid = wiidparam[0];
				}
			} else {
				Wiid = jQuery.sap.getUriParameters().get("Wiid");
			}
			this._readTaskInfo(Wiid);
		},
		onBeforeUploadStarts: function(oEvent) {
			// Header Slug
			var oCustomerHeaderSlug = new UploadCollectionParameter({
				name: "slug",
				value: oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			MessageToast.show("BeforeUploadStarts event triggered.");
		},
		formatAttribute: function(sValue) {
			if (jQuery.isNumeric(sValue)) {
				return FileSizeFormat.getInstance({
					binaryFilesize: false,
					maxFractionDigits: 1,
					maxIntegerDigits: 3
				}).format(sValue);
			} else {
				return sValue;
			}
		},
		onChange: function(oEvent) {
			var oUploadCollection = oEvent.getSource();
			// Header Token
			var oCustomerHeaderToken = new UploadCollectionParameter({
				name: "x-csrf-token",
				value: "securityTokenFromModel"
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},
		onDownloadItem: function() {
			var oUploadCollection = this.byId("UploadCollection");
			var aSelectedItems = oUploadCollection.getSelectedItems();
			oUploadCollection.downloadItem(aSelectedItems[1], true);
		},
		_readTaskInfo: function(Wiid) {
			var oTasksModel = this.getOwnerComponent().getModel("Tasks");
			var mParams = {
				urlParameters: {
					"$expand": "TaskDtl_Lines,TaskDtl_Attach"
				},
				success: function(oData) {
					this._initTaskInfo(oData);
					var oModel = new JSONModel(oData);
					// this.getView().setModel(oModel);
					this.getView().setModel(oModel, "JV");
					this.getView().setBusy(false);
				}.bind(this),
				error: function(oError) {
					this.getView().destroyContent();
					this.getView().setBusy(false);
					MessageToast.show("Error Reading Task Details. Your inbox is being refreshed");
				}.bind(this)
			};
			var taskurl = "/TaskDtlSet('" + Wiid + "')";
			this.getView().setBusy(true);
			oTasksModel.read(taskurl, mParams);
			// Now read the workflow log for the work item (JV)
			mParams = {
				urlParameters: {
					"$expand": "ApproverSet"
				},
				success: function(oData) {
					var oModel = new JSONModel(oData);
					this.getView().setModel(oModel, "JVAppr");
				}.bind(this),
				error: function(oError) {
					MessageToast.show("Error Reading Task Workflow Log.");
				}.bind(this)
			};
			taskurl = "/TaskDtlSet('" + Wiid + "')/TASKDTL_WI";
			this.getView().setBusy(true);
			oTasksModel.read(taskurl, mParams);
		},
		_initTaskInfo: function(oData) {
			var showWBS, colfr, colio, colpernr, colwbsorig, colbukrs, bukrs, docdate, postdate;
			$.each(oData.TaskDtl_Lines.results, function(index, obj) {
				if ((oData.Blart === "TR") && (String([obj.Projk]) !== "")) {
					showWBS = "X";
				}
				if (String([obj.Xref1]) !== "") {
					colwbsorig = "X";
				}
				if (String([obj.Aufnr]) !== "") {
					colio = "X";
				}
				if (String([obj.Pernr]) !== "00000000") {
					colpernr = "X";
				} else {
					obj.Pernr = "";
				}
				if (String([obj.Kblnr]) !== "") {
					colfr = "X";
				}
				if (index == "0") {
					bukrs = String([obj.Bukrs]);
				}
				if (String([obj.Bukrs]) !== bukrs) {
					colbukrs = "X";
				}
			});
			var oTaskInfo = new JSONModel({
				showWBS: ((showWBS === "X") ? true : false),
				colwbsorig: ((colwbsorig === "X") ? true : false),
				colio: ((colio === "X") ? true : false),
				colpernr: ((colpernr === "X") ? true : false),
				colfr: ((colfr === "X") ? true : false),
				colbukrs: ((colbukrs === "X") ? true : false),
				docdate: ((docdate === "X") ? true : false),
				postdate: ((postdate === "X") ? true : false)
			});
			this.getView().setModel(oTaskInfo, "TaskInfo");
			// Grouper function to be supplied as 3rd parm to Sorter
			// Note that it uses the mGroupInfo, as does the Sorter
			// var oSorter = new sap.ui.model.Sorter("ZjvAppGrpkey", null);
			// var url, fname, fsize, mimetype, createby, uplddate;
		}
	});
});