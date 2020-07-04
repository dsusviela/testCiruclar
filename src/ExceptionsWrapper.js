import React from "react";

export default class ExceptionWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidCatch(error, info) {
    console.log("error");
  }

  render() {
    return this.props.children;
  }
}
