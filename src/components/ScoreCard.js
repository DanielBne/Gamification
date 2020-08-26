import React from "react";

export class ScoreCard extends React.Component {

    render() {
        return (
            <div className="scorecard">
                <img className="dp" src={this.props.user.profilePic} alt="display" />

                <div>
                    <div className="detail">
                        <div>{this.props.user.name}</div>
                        <div>{this.props.user.title}</div>
                    </div>

                    <div className="level">
                        <div>Level: {this.props.user.level} ({this.props.user.xp}xp)</div>
                    </div>
                </div>
            </div>
        );
    }
}