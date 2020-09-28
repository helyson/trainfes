const { Schema } = require("mongoose");
const mongoose_delete = require('mongoose-delete');
const { tenantlessModel } = require("../../lib/multiTenant");

const PlanEnum = ["basic", "medium", "premium"];

const OrganizationSchema = new Schema({
  name: String,
  plan: {
    type: String,
    enum: PlanEnum,
  },
  address: String,
  phone: String,
  rut: String
},{ timestamps: true });

OrganizationSchema.plugin(mongoose_delete, { deletedAt : true })

module.exports = tenantlessModel('Organization', OrganizationSchema);