import React from "react";
import { ScoreCard } from "./ScoreCard";
import { Error } from "./Error";
import { calculateXpForUsers } from "../logic/xp"
import "./Leaderboard.css";

export class Leaderboard extends React.Component {
    render() {
        let message = null;
        let error = null;
        try {
            message = this.calculateXP();
        }
        catch (e) {
            console.log(e);
            error = e.message || e;
        }

        return (
            <div className="Leaderboard">
                <Title boards={this.props.boards} />
                <div className="scorecards">
                    <Content message={message} error={error} users={this.props.users} />
                </div>
            </div>
        );
    }
    

    /**
     * Modifies this.props.users to give XP totals and then levels to each user.
     * Relies on this.props.boards (passed in) and this.props.users.
     */
    calculateXP() {
        // No calculation required if we have no users.
        if(!this.props.users || !this.props.users.length) {
            return "Loading users...";
        }

        // No calculation required for no boards.
        if(!this.props.boards || !this.props.boards.length) {
            return "Loading board...";
        }

        calculateXpForUsers(this.props.users, this.props.boards, this.props.settings);
        return null;
    }
}

// Inner component of the leaderboard, renders a bunch of scorecards or a message.
function Content(props) {
    if(props.message) {
        return props.message;
    }
    else if(props.error) {
        return <Error whatFailed="determine XP" message={props.error} />
    }
    else if(props.users) {
        return props.users.map((user) =>
            <ScoreCard key={user.id} user={user} />
        );
    }
    else {
        return "Loading..."
    }
}

// Returns the title, which is made up of the board names being viewed.
function Title(props) {
    const boards = props.boards
    if(!boards || boards.length === 0) {
        return <h1>Loading...</h1>
    }
    const csv = boards.map((x) => x.name).join(", ");
    return <h1>XP for {csv}</h1>;
}