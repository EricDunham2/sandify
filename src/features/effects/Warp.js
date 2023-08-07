import Victor from "victor"
import Effect from "./Effect"
import { subsample } from "@/common/geometry"
import { evaluate } from "mathjs"

const options = {
  warpType: {
    title: "Warp type",
    type: "dropdown",
    choices: ["angle", "quad", "circle", "grid", "shear", "custom"],
    onChange: (model, changes, state) => {
      if (["angle", "quad", "shear"].includes(changes.warpType)) {
        changes.rotation = changes.warpType === "shear" ? 0 : 45
      } else {
        changes.rotation = 0
      }

      return changes
    },
  },
  period: {
    title: "Period",
    step: 0.2,
    isVisible: (layer, state) => {
      return !["custom", "shear"].includes(state.warpType)
    },
  },
  xMathInput: {
    title: "X(x,y)",
    delayKey: "xMath",
    type: "text",
    isVisible: (layer, state) => {
      return state.warpType === "custom"
    },
  },
  yMathInput: {
    title: "Y(x,y)",
    delayKey: "yMath",
    type: "text",
    isVisible: (layer, state) => {
      return state.warpType === "custom"
    },
  },
  subsample: {
    title: "Subsample points",
    type: "checkbox",
  },
}

export default class Warp extends Effect {
  constructor() {
    super("warp")
    this.label = "Warp"
    this.startingWidth = 40
    this.startingHeight = 40
  }

  canRotate(state) {
    return ["angle", "quad", "shear"].includes(state.warpType)
  }

  canChangeSize(state) {
    return state.warpType !== "custom"
  }

  canChangeHeight(state) {
    return false
  }

  getInitialState() {
    return {
      ...super.getInitialState(),
      ...{
        warpType: "angle",
        period: 10.0,
        subsample: true,
        xMathInput: "x + 4*sin((x+y)/20)",
        xMath: "x + 4*sin((x+y)/20)",
        yMathInput: "y + 4*sin((x-y)/20)",
        yMath: "y + 4*sin((x-y)/20)",
        rotation: 45,
      },
    }
  }

  // TODO: replace with bounds for transformer
  /*getVertices(state) {
    const width = state.shape.width
    return circle(width / 2)
  }*/

  getVertices(effect, layer, vertices) {
    if (effect.subsample) {
      vertices = subsample(vertices, 2.0)
    }

    if (effect.warpType === "angle" || effect.warpType === "quad") {
      return this.angle(
        effect.warpType === "angle" ? +1.0 : -1.0,
        effect,
        vertices,
      )
    } else if (effect.warpType === "circle") {
      return this.circle(effect, vertices)
    } else if (effect.warpType === "grid") {
      return this.grid(effect, vertices)
    } else if (effect.warpType === "shear") {
      return this.shear(effect, vertices)
    } else if (effect.warpType === "custom") {
      return this.custom(effect, vertices)
    }

    return vertices
  }

  angle(ySign, effect, vertices) {
    const periodx =
      (10.0 * effect.period) /
      (Math.PI * 2.0) /
      Math.cos((-effect.rotation / 180.0) * Math.PI)
    const periody =
      (10.0 * effect.period) /
      (Math.PI * 2.0) /
      Math.sin((-effect.rotation / 180.0) * Math.PI)
    const scale = effect.width / 10.0

    return vertices.map((vertex) => {
      const originalx = vertex.x - effect.x
      const originaly = vertex.y - effect.y
      const x =
        originalx + scale * Math.sin(originalx / periodx + originaly / periody)
      const y =
        originaly +
        scale * Math.sin(originalx / periodx + (ySign * originaly) / periody)
      return new Victor(x + effect.x, y + effect.y)
    })
  }

  circle(effect, vertices) {
    const periodx = (10.0 * effect.period) / (Math.PI * 2.0)
    const periody = (10.0 * effect.period) / (Math.PI * 2.0)
    const scale = effect.width / 10.0

    return vertices.map((vertex) => {
      const originalx = vertex.x - effect.x
      const originaly = vertex.y - effect.y
      const theta = Math.atan2(originaly, originalx)
      const x =
        originalx +
        scale *
          Math.cos(theta) *
          Math.cos(
            Math.sqrt(originalx * originalx + originaly * originaly) / periodx,
          )
      const y =
        originaly +
        scale *
          Math.sin(theta) *
          Math.cos(
            Math.sqrt(originalx * originalx + originaly * originaly) / periody,
          )
      return new Victor(x + effect.x, y + effect.y)
    })
  }

  grid(effect, vertices) {
    const periodx = (10.0 * effect.period) / (Math.PI * 2.0)
    const periody = (10.0 * effect.period) / (Math.PI * 2.0)
    const scale = effect.width / 10.0

    return vertices.map((vertex) => {
      const originalx = vertex.x - effect.x
      const originaly = vertex.y - effect.y
      const x =
        originalx +
        scale * Math.sin(originalx / periodx) * Math.sin(originaly / periody)
      const y =
        originaly +
        scale * Math.sin(originalx / periodx) * Math.sin(originaly / periody)
      return new Victor(x + effect.x, y + effect.y)
    })
  }

  shear(effect, vertices) {
    const shear = (effect.width - 1) / 100
    const xShear = shear * Math.sin((effect.rotation / 180.0) * Math.PI)
    const yShear = shear * Math.cos((effect.rotation / 180.0) * Math.PI)
    return vertices.map(
      (vertex) =>
        new Victor(vertex.x + xShear * vertex.y, vertex.y + yShear * vertex.x),
    )
  }

  custom(effect, vertices) {
    return vertices.map((vertex) => {
      try {
        const x = evaluate(effect.xMath, {
          x: vertex.x - effect.x,
          y: vertex.y - effect.y,
        })
        const y = evaluate(effect.yMath, {
          x: vertex.x - effect.x,
          y: vertex.y - effect.y,
        })
        return new Victor(x + effect.x, y + effect.y)
      } catch (err) {
        console.log("Error parsing custom effect: " + err)
        return vertex
      }
    })
  }

  getOptions() {
    return options
  }
}
