import React, { PropTypes, Component } from 'react'
import ignoreEvent from '../utils/ignoreEvent'
import xOfPin from '../utils/xOfPin'
import computeNodeWidth from '../utils/computeNodeWidth'
import defaultTheme from './theme'

class Node extends Component {
  getBody () {
    const {
      pinSize,
      text
    } = this.props

    // TODO place an id in the div wrapping the body and try to
    // resolve bodyHeight from its content.

    return (
      <p
        style={{
          marginLeft: pinSize,
          marginRight: pinSize,
          pointerEvents: 'none'
        }}
      >
        {text}
      </p>
    )
  }

  render () {
    const {
      bodyHeight,
      fill,
      fontSize,
      id,
      ins,
      onCreateLink,
      onEnterPin,
      onLeavePin,
      outs,
      pinSize,
      selected,
      selectNode,
      text,
      width,
      x,
      y
    } = this.props

    const body = this.getBody()

    const computedWidth = computeNodeWidth({
      bodyHeight,
      pinSize,
      fontSize,
      text,
      width
    })

    return (
      <g
        onClick={ignoreEvent}
        onDoubleClick={ignoreEvent}
        onMouseDown={selectNode}
        style={{
          cursor: (selected ? 'pointer' : 'default')
        }}
        transform={`translate(${x},${y})`}
      >
        <rect
          fill={fill.border}
          height={pinSize}
          width={computedWidth}
        />
        {ins.map((pin, i, array) => {
          // TODO const name = (typeof pin === 'string' ? { name: pin } : pin)
          const x = xOfPin(pinSize, computedWidth, array.length, i)

          const onEnterPinIn = (e) => {
            e.preventDefault()
            e.stopPropagation()

            onEnterPin({
              type: 'in',
              nodeId: id,
              position: i,
              pin
            })
          }

          const onLeavePinIn = (e) => {
            onLeavePin()
          }

          return (
            <rect
              key={i}
              fill={fill.pin}
              height={pinSize}
              onMouseEnter={onEnterPinIn}
              onMouseLeave={onLeavePinIn}
              transform={`translate(${x},0)`}
              width={pinSize}
            />
          )
        })}
        <foreignObject
          height={bodyHeight}
          onClick={ignoreEvent}
          onDoubleClick={ignoreEvent}
          onMouseDown={selectNode}
          transform={`translate(0,${pinSize})`}
          width={computedWidth}
        >
          <div
            style={{backgroundColor: fill.body}}
          >
            {body}
          </div>
        </foreignObject>
        <rect
          fill={fill.border}
          height={pinSize}
          transform={`translate(0,${pinSize + bodyHeight})`}
          width={computedWidth}
        />
        {outs.map((pin, i, array) => {
          const x = xOfPin(pinSize, computedWidth, array.length, i)

          const onMouseDown = (e) => {
            e.preventDefault()
            e.stopPropagation()

            onCreateLink({ from: [ id, i ], to: null })
          }

          return (
            <rect
              key={i}
              fill={fill.pin}
              height={pinSize}
              onClick={ignoreEvent}
              onMouseLeave={ignoreEvent}
              onMouseDown={onMouseDown}
              transform={`translate(${x},${pinSize + bodyHeight})`}
              width={pinSize}
            />
          )
        })}
      </g>
    )
  }
}

Node.propTypes = {
  bodyHeight: PropTypes.number.isRequired,
  fill: PropTypes.shape({
    body: PropTypes.string.isRequired,
    border: PropTypes.string.isRequired,
    pin: PropTypes.string.isRequired
  }).isRequired,
  fontSize: PropTypes.number.isRequired,
  id: PropTypes.string,
  ins: PropTypes.array.isRequired,
  outs: PropTypes.array.isRequired,
  onCreateLink: PropTypes.func.isRequired,
  onEnterPin: PropTypes.func.isRequired,
  onLeavePin: PropTypes.func.isRequired,
  pinSize: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  width: PropTypes.number,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}

Node.defaultProps = {
  bodyHeight: defaultTheme.nodeBodyHeight,
  fill: {
    body: 'whitesmoke',
    border: 'lightgray',
    pin: 'darkgray' // Ahahah darkgray is not darker than gray
    // Actually we have
    // whitesmoke < lightgray < darkgray < gray
  },
  ins: [],
  onCreateLink: Function.prototype,
  onEnterPin: Function.prototype,
  onLeavePin: Function.prototype,
  outs: [],
  pinSize: defaultTheme.pinSize,
  selected: false,
  selectNode: Function.prototype,
  text: 'Node'
}

export default Node
