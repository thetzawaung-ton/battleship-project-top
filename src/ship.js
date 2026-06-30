export class Ship {
  #length;
  #hits;
  constructor(length) {
    this.#length = length;
    this.#hits = 0;
  }
  getLength() {
    return this.#length;
  }
  hit() {
    return this.#hits++;
  }
  getHits() {
    return this.#hits;
  }
  isSunk() {
    let hits = this.getHits();
    if (hits >= this.#length) {
      return true;
    }
    return false;
  }
}
