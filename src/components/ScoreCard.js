import React from "react";
import { Progress } from "./Progress";

export class ScoreCard extends React.Component {

    render() {
        const user = this.props.user;
        return (
            <div className="scorecard">
                <div className="info">
                    <img className="dp" src={user.photo_thumb_small} alt="display" />
                    <div>
                        <div className="detail">
                            <div>{user.name}</div>
                            <div>{user.title}</div>
                        </div>

                        <div className="level">
                            <div>{user.xp}xp total</div>
                        </div>
                    </div>
                </div>

                <Progress percent={user.progress} 
                    messageLeft={`Level ${user.level}`} 
                    messageRight={`XP: ${user.xpThisLevel}/${user.xpToLevel}`} />
            </div>
        );
    }
}