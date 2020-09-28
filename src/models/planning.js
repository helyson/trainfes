const { Schema } = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { tenantModel } = require("../../lib/multiTenant");

const PlanningSchema = new Schema(
  {
    name: String,
    links: [String],
    planningDate: Date,
    sessions: [
      {
        type: Schema.ObjectId,
        ref: "Session",
      },
    ],
  },
  { timestamps: true }
);

PlanningSchema.plugin(mongoose_delete, { deletedAt: true });

module.exports = tenantModel("Planning", PlanningSchema);
