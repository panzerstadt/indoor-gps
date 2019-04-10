import React, { Component } from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";

export default class Carousel extends Component {
  static defaultProps = {
    minValue: 5,
    settings: {}
  };
  ref = React.createRef();

  componentDidMount() {
    window.addEventListener("touchstart", this.touchStart);
    window.addEventListener("touchmove", this.preventTouch, { passive: false });
  }

  componentWillUnmount() {
    window.removeEventListener("touchstart", this.touchStart);
    window.removeEventListener("touchmove", this.preventTouch, {
      passive: false
    });
  }

  touchStart(e) {
    this.firstClientX = e.touches[0].clientX;
    this.firstClientY = e.touches[0].clientY;
  }

  preventTouch(e) {
    const minValue = 5;

    this.clientX = e.touches[0].clientX - this.firstClientX;
    this.clientY = e.touches[0].clientY - this.firstClientY;

    // turn off vertical scrolling when you start horizontal swipe
    try {
      const reactSlickDiv = e.touches[0].target.offsetParent.className;

      if (reactSlickDiv === "react-slick") {
        if (Math.abs(this.clientX) > minValue) {
          e.preventDefault();
          e.returnValue = false;
          return false;
        }
      }
    } catch {
      if (Math.abs(this.clientX) > minValue) {
        e.preventDefault();
        e.returnValue = false;
        return false;
      }
    }
  }

  render() {
    return (
      <div className={this.props.className}>
        <Slider ref={this.ref} {...this.props.settings}>
          {this.props.children}
        </Slider>
      </div>
    );
  }
}
