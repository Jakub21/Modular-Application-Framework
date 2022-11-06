
module.exports = class Context {
  constructor(logger, issuer) {
    this.logger = logger;
    this.issuer = issuer;
  }
  entry(...message) {
    this.logger.entry(this.issuer, ...message);
  }
  context(subIssuer) {
    let sep = this.logger._config.get('issuerSeparator');
    return new Context(this.logger, `${this.issuer}${sep}${subIssuer}`);
  }
}
