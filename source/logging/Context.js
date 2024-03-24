
export default class Context {
  constructor(logger, issuer) {
    this.logger = logger;
    this.issuer = issuer;
  }
  entry(...message) {
    this.logger.entry(this.issuer, ...message);
  }
  context(instance, subIssuer) {
    let sep = '.';
    let context = new Context(this.logger, `${this.issuer}${sep}${subIssuer}`);
    instance.log = (...p) => {context.entry(...p)};
    return context;
  }
}
