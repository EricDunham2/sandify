import React from "react"
import { SortableContainer, SortableElement } from "react-sortable-hoc"
import { Button, ListGroup } from "react-bootstrap"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import Layer from "./Layer"

const LayerRow = SortableElement(
  ({
    active,
    numLayers,
    layer,
    onSortStarted,
    handleLayerSelected,
    handleToggleLayerVisible,
  }) => {
    const { name, id, visible } = layer
    const activeClass = active ? "active" : ""
    const dragClass = numLayers > 1 ? "cursor-move" : ""
    const visibleClass = visible ? "" : "layer-hidden"
    const instance = new Layer(layer.type)

    return (
      <ListGroup.Item
        className={[activeClass, dragClass, visibleClass, "layer p-0"].join(
          " ",
        )}
        key={id}
        id={id}
      >
        <div
          className={[`layer-${activeClass}`, "d-flex align-items-center"].join(
            " ",
          )}
          onClick={handleLayerSelected}
        >
          <div className="layer-left">
            <Button
              className="layer-button"
              variant="light"
              data-id={id}
              onClick={handleToggleLayerVisible.bind(this, id)}
            >
              {visible && <FaEye size="0.8em" />}
              {!visible && <FaEyeSlash size="0.8em" />}
            </Button>
          </div>

          <div className="d-flex no-select flex-grow-1 align-items-center">
            <div className="flex-grow-1">{name}</div>
            <span
              className="mr-3"
              style={{ fontSize: "80%" }}
            >
              {instance.model.label}
            </span>
          </div>
        </div>
      </ListGroup.Item>
    )
  },
)

const LayerList = SortableContainer(({ layers, currentLayer, ...other }) => {
  return (
    <ListGroup
      variant="flush"
      style={{ maxHeight: "240px" }}
      className="border overflow-auto"
      id="layers"
    >
      {layers.map((layer, index) => {
        return (
          <LayerRow
            key={layer.id}
            id={layer.id}
            index={index}
            active={currentLayer.id === layer.id}
            layer={layer}
            {...other}
          />
        )
      })}
    </ListGroup>
  )
})

export default LayerList
