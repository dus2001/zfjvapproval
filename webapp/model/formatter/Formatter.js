sap.ui.define([], function() {
	"use strict";
	return {
		getApprovalIconColor: function(WorkItemState) {
			switch (WorkItemState) {
				case "N":
					return "gray";
				case "I":
					return 'blue';
				case "C":
					return 'green';
				default:
					return 'red';
			}
		},
		WorkflowLogIcon: function(WorkItemState) {
			switch (WorkItemState) {
				case "N":
					return 'sap-icon://lateness';
				case "I":
					return 'sap-icon://pending';
				case "C":
					return 'sap-icon://complete';
				default:
					return 'sap-icon://incident';
			}
		},
		WorkflowLogToolTip: function(WorkItemState) {
			switch (WorkItemState) {
				case "N":
					return "Not Started";
				case "I":
					return "In Process";
				case "C":
					return 'Complete';
				default:
					return 'Error';
			}
		}
	};
});