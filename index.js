// Module root

module.exports = {
  Config: require('./source/config/Config.js'),
  Application: require('./source/core/Application.js'),
  MafModule: require('./source/core/MafModule.js').MafModule,
  Event: require('./source/core/Event.js'),
  logging: require('./source/logging'),
};
