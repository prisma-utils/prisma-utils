export class DecoratorHelper {
  constructor(
    public name: string,
    public importFrom: string,
    public options: string = '',
  ) {
    if (this.name.startsWith('@')) {
      this.name = this.name.substring(1);
    }
  }

  public generateContent() {
    return `@${this.name}(${this.options})`;
  }
}
