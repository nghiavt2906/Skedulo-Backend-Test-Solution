class Stack {
  private items: any[];

  public constructor() {
    this.items = [];
  }

  public push(item: any) {
    this.items.push(item);
  }

  public pop() {
    return this.items.length > 0 ? this.items.pop() : null;
  }

  public peek() {
    return this.items.length > 0 ? this.items[this.items.length - 1] : null;
  }

  public isEmpty() {
    return this.items.length === 0;
  }

  public size() {
    return this.items.length;
  }
}

export default Stack;
