const mongoose = require('mongoose');
const storage = require("./storage");

function tenantModel(name, schema, options) {
  return (props = {}) => {
    schema.add({ tenantId: String });
    const Model = mongoose.model(name, schema, options);

    const { skipTenant, organizationId } = props;
    if (skipTenant) return Model;

    Model.schema.set('discriminatorKey', 'tenantId');

    const tenantId = storage.getCurrent('tenantId') || organizationId;
    const discriminatorName = `${Model.modelName}-${tenantId}`;
    const existingDiscriminator = (Model.discriminators || {})[discriminatorName];
    return existingDiscriminator || Model.discriminator(discriminatorName, new mongoose.Schema({}));
  };
}

function tenantlessModel(name, schema, options) {
  return () => mongoose.model(name, schema, options);
}

module.exports = {
  tenantModel,
  tenantlessModel
};
