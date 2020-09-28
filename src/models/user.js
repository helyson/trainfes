const multiTenant = require("../../lib/multiTenant");
const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');
const { Schema } = mongoose;
const { tenantModel } = multiTenant;

const InsaranceEnum = [
  "banmedica",
  "colmena",
  "consalud",
  "cruzBlanca",
  "fonasa",
];

const UserSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  rut: String,
  lastname: String,
  coutry: String,
  city: String,
  region: String,
  gender: String,
  birthday: Date,
  organization: {
    type: mongoose.Schema.ObjectId, ref: 'Organization'
   },
  insurance: {
    type: String,
    enum: InsaranceEnum,
  },
  plannings: [
    {
      type: Schema.ObjectId,
      ref: "Planning",
    },
  ],
},{ timestamps: true });

UserSchema.plugin(mongoose_delete, { deletedAt : true })

module.exports = tenantModel("User", UserSchema);
