import React from "react";

export class ScoreCard extends React.Component {
    render() {
        return (
            <div class="scorecard">
                <div>
                    <img src={this.props.user.photo_tiny} alt="display" />
                </div>

                <div class="detail">
                    <div>
                        {this.props.user.name}
                    </div>
                    <div>
                        {this.props.user.title}
                    </div>
                </div>

                <div class="xp"></div>
            </div>
        );
    }
}