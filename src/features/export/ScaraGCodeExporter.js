import GCodeExporter from "./GCodeExporter"
import { subsample, toThetaRho, toScaraGcode } from "@/common/geometry"

export default class ScaraGCodeExporter extends GCodeExporter {
  constructor(props) {
    super(props)
    this.offsetX = 0
    this.offsetY = 0
  }

  // transforms vertices into a SCARA GCode format
  transformVertices(vertices) {
    vertices = toScaraGcode(
      toThetaRho(
        subsample(vertices, 2.0),
        this.props.maxRadius,
        parseFloat(this.props.polarRhoMax),
      ),
      parseFloat(this.props.unitsPerCircle),
    )

    return super.transformVertices(vertices)
  }
}
