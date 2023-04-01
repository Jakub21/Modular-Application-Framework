// Module root

module.exports = {
  Config: require('./source/config/Config.js'),
  Application: require('./source/core/Application.js'),
  MafModule: require('./source/core/MafModule.js').MafModule,
  logging: require('./source/logging'),
};
