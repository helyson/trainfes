const { Schema } = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { tenantModel } = require("../../lib/multiTenant");

const ModeEnum = ["flexion", "march", "sensor"];

const validateParams = (params) => {
  return  !!params.series && !!params.repeat
}
const SessionSchema = new Schema(
  {
    name: String,
    description: String,
    objective: String,
    type: {
      type: String,
      enum: ModeEnum,
    },
    parameters: {type: Schema.Types.Mixed, required: true, validate: [validateParams, "parameters must contain minimum parameters of repeat and series"] },
  },
  { timestamps: true }
);

SessionSchema.plugin(mongoose_delete, { deletedAt: true });

module.exports = tenantModel("Session", SessionSchema);
