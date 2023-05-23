import { Graphics, Rectangle } from "pixi.js";
import { MutableRefObject } from "react";


interface PinInterface {
  value: number;
  position?: { x: number, y: number };
  connections: Wire[];
}

export class InputPin implements PinInterface {
  value: number;
  position?: { x: number, y: number };
  connections: Wire[];

  constructor() {
    this.value = 0;
    this.connections = [];
  }

  connect(output: OutputPin) {
    const wire = new Wire(this, output);
    this.connections.push(wire);
    output.connections.push(wire);
  }

  removeWire(wire: Wire) {
    this.connections = this.connections.filter((w) => w.id !== wire.id);
  }

  disconnect(output: OutputPin) {
    this.connections = this.connections.filter((wire) => wire.output !== output);
    output.connections = output.connections.filter((wire) => wire.input !== this);
  }

  update() {
    this.value = 0;
    for (const wire of this.connections) {
      if (wire.output?.value) {
        this.value = 1;
        break;
      }
    }
  }
}

export class OutputPin implements PinInterface {
  value: number;
  position?: { x: number, y: number };
  connections: Wire[];

  constructor() {
    this.value = 0;
    this.connections = [];
  }

  connect(input: InputPin) {
    const wire = new Wire(input, this);
    this.connections.push(wire);
    input.connections.push(wire);
  }

  removeWire(wire: Wire) {
    this.connections = this.connections.filter((w) => w.id !== wire.id);
  }

  disconnect(input: InputPin) {
    this.connections = this.connections.filter((wire) => wire.input !== input);
    input.connections = input.connections.filter((wire) => wire.output !== this);
  }
}

let wireUid = 0;

export class Wire {
  id: string;
  input?: InputPin;
  output?: OutputPin;

  constructor(input?: InputPin, output?: OutputPin) {
    this.id = `wire_${wireUid++}`;
    this.input = input;
    this.output = output;
  }
}

export class Chip {
  id: string;
  inputs: InputPin[];
  output: OutputPin;
  rect?: Rectangle;

  constructor(id: string, nOfInputs: number) {
    this.id = id;
    this.inputs = [];
    for (let i = 0; i < nOfInputs; i++) {
      this.inputs.push(new InputPin());
    }
    this.output = new OutputPin();
  }

  connectInput(inputIndex: number, output: OutputPin) {
    this.inputs[inputIndex].connect(output);
    this.update();
  }

  connectOutput(input: InputPin) {
    this.output.connect(input);
    this.update();
  }

  disconnect(inputIndex: number, output: OutputPin) {
    this.inputs[inputIndex].disconnect(output);
    this.update();
  }

  update() {
    for (const input of this.inputs) {
      input.update();
    }
  }

  getOutputValue() {
    this.update();
    return this.output.value;
  }

  // TODO Convert Chip to System
}

export class AndGate extends Chip {
  constructor(id: string) {
    super(id, 2);
  }

  update() {
    super.update();
    this.output.value = this.inputs[0].value && this.inputs[1].value ? 1 : 0;
  }
}

export class NotGate extends Chip {
  constructor(id: string) {
    super(id, 1);
  }

  update() {
    super.update();
    this.output.value = this.inputs[0].value ? 0 : 1;
  }
}

export class SystemInput extends OutputPin { }
export class SystemOutput extends InputPin { }

export class System {
  chips: Chip[];
  systemInputs: SystemInput[];
  systemOutput: SystemOutput;

  constructor(nOfSystemInputs: number) {
    this.chips = [];
    this.systemInputs = [];
    for (let i = 0; i < nOfSystemInputs; i++) {
      this.systemInputs.push(new SystemInput());
    }
    this.systemOutput = new SystemOutput();
  }

  setInputValue(inputIndex: number, value: number) {
    this.systemInputs[inputIndex].value = value;
    this.update();
  }

  addChip(chip: Chip) {
    this.chips.push(chip);
  }

  // TODO Remove Chip

  update() {
    for (const chip of this.chips) {
      chip.update();
    }
    this.systemOutput.update();
  }

  getValue() {
    this.update();
    return this.systemOutput.value;
  }

  convertSystemToChip(id: string) {
    const chip = new Chip(id, this.systemInputs.length);
    chip.update = () => {
      for (const input of chip.inputs) {
        input.update();
      }
      for (let i = 0; i < this.systemInputs.length; i++) {
        this.systemInputs[i].value = chip.inputs[i].value;
      }
      this.update();
      chip.output.value = this.systemOutput.value;
    }
    return chip;
  }
}
