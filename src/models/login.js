const { Schema } = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const { tenantlessModel } = require("../../lib/multiTenant");

const RoleEnum = ["admin", "root", "user"];

const dv = (T) => {
  var M = 0,
    S = 1;
  for (; T; T = Math.floor(T / 10)) S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
  return S ? S - 1 : "k";
};

const validateRut = (rut) => {
  if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) return false;
  var tmp = rut.split("-");
  var digv = tmp[1];
  var rut = tmp[0];
  if (digv == "K") digv = "k";
  return dv(rut) == digv;
};

const LoginSchema = new Schema(
  {
    rut: { type: String, unique: true, required: true, validate: [validateRut, "rut is invalid"] },
    password: String,
    role: {
      type: String,
      enum: RoleEnum,
    },
    user: {
      type: Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

LoginSchema.plugin(mongoose_delete, { deletedAt: true });

module.exports = tenantlessModel("Login", LoginSchema);
