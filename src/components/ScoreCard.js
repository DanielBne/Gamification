import React from "react";

export class ScoreCard extends React.Component {

    render() {
        return (
            <div class="scorecard">

                <div class="topscorecard">
                    
                    <img class="dp" src={this.props.user.profilePic} alt="display" />

                    <div class="detail">
                        <div>
                            {this.props.user.name}
                        </div>
                        <div>
                            {this.props.user.title}
                        </div>
                        <div>
                            Level {this.props.user.level}
                        </div>
                    </div>
                </div>

                <div class="xp">

                </div>
            </div>
        );
    }
}