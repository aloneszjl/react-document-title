"use strict";

var React = require("react"),
  PropTypes = require("prop-types"),
  withSideEffect = require("react-side-effect");

function isIOS() {
  const userAgent = getUserAgent();
  return (
    userAgent.match(/iPad/i) ||
    userAgent.match(/iPhone/i) ||
    userAgent.match(/iPod/i)
  );
}

function reducePropsToState(propsList) {
  var innermostProps = propsList[propsList.length - 1];
  if (innermostProps) {
    return innermostProps.title;
  }
}

function handleStateChangeOnClient(title) {
  var nextTitle = title || "";
  if (nextTitle !== document.title) {
    document.title = nextTitle;
    if (isIOS()) {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.setAttribute("src", "./favicon.ico");
      const d = function() {
        setTimeout(function() {
          iframe.removeEventListener("load", d);
          document.body.removeChild(iframe);
        }, 0);
      };
      iframe.addEventListener("load", d);
      document.body.appendChild(iframe);
    }
  }
}

function DocumentTitle() {}
DocumentTitle.prototype = Object.create(React.Component.prototype);

DocumentTitle.displayName = "DocumentTitle";
DocumentTitle.propTypes = {
  title: PropTypes.string.isRequired
};

DocumentTitle.prototype.render = function() {
  if (this.props.children) {
    return React.Children.only(this.props.children);
  } else {
    return null;
  }
};

module.exports = withSideEffect(reducePropsToState, handleStateChangeOnClient)(
  DocumentTitle
);
