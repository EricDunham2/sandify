import React, { Component } from "react"

class CommentsBox extends Component {
  render() {
    const option = this.props.options[this.props.optionKey]
    const renderedComments = this.props.comments.map((comment, index) => {
      return (
        <span key={index}>
          {comment}
          <br />
        </span>
      )
    })

    return (
      <div id="comments" className="mt-4 p-3">
        {option.title}:<div className="ml-3">{renderedComments}</div>
      </div>
    )
  }
}

export default CommentsBox
