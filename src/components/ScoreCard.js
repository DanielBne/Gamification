import React from "react";
const { render } = require("@testing-library/react")

export class ScoreCard extends React.Component {
    render() {
        return (
            <div class="scorecard">
                <div class="details">
                    Hello, {this.props.user}
                </div>
                <div class="xp"></div>
            </div>
        );
    }
}

ScoreCard.defaultProps = {
    user: {}
  };