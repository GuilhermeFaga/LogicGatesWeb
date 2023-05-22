
export const config = {
  colors: {
    dottedGrid: "363636",
    border: "000000",
    selectedBorder: "F1F1F1",
    highlightBorder: "7ADD6A",
    connection: "000000",
    on: "c3001c",
    off: "525252",
    darkOn: "400000",
    darkOff: "222222",
    board: "8e24c4",
    andGate: "de6426",
    notGate: "2856c5",
    mouseOver: {
      on: "D74C4C",
      off: "8E8E8E"
    },
  },
  components: {
    dottedGrid: {
      gap: 20,
      dotSize: 1
    },
    gate: {
      padding: 16,
      pinOffset: 24,
      pinWidth: 32,
      pinGap: 8
    },
    system: {
      pinWidth: 32,
      pinGap: 32
    },
    board: {
      borderWidth: 5,
      borderRadius: 8,
      offset: 8
    },
    pin: {
      borderWidth: 5,
      width: 32
    }
  }
}