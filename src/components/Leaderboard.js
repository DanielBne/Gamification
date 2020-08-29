import React from "react";
import { ScoreCard } from "./ScoreCard";
import { Error } from "./Error";
import { calculateXpForUsers } from "../logic/xp"
import mondaySdk from "monday-sdk-js";
import "./Leaderboard.css";
const monday = mondaySdk();

export class Leaderboard extends React.Component {

    constructor(props) {
        super(props);

        // Default state
        this.state = {
            users: []
        };

        this.getUsers();
    }

    getUsers = () => {
        monday
            .api(`query { users { id, name, title, photo_thumb_small } }`)
            .then((res) => {
                const users = res.data.users.map((user) => {
                    user.xp = 0;
                    user.level = 0;
                    return user;
                });

                this.setState({ users: users });
            });
    }

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
                    <ScoreCards message={message} error={error} users={this.state.users} />
                </div>
            </div>
        );
    }
    

    /**
     * Modifies this.state.users to give XP totals and then levels to each user.
     * Relies on this.props.boards (passed in) and this.state.users.
     */
    calculateXP() {
        // No calculation required if we have no users.
        if(!this.state || !this.state.users || !this.state.users.length) {
            return "Loading users...";
        }

        // No calculation required for no boards.
        if(!this.props.boards || !this.props.boards.length) {
            return "Loading board...";
        }

        calculateXpForUsers(this.state.users, this.props.boards, this.props.settings);
        return null;
    }
}

// Inner component of the leaderboard, renders a bunch of scorecards or a message.
function ScoreCards(props) {
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
        return <h1>Please select a board to view</h1>
    }
    const csv = boards.map((x) => x.name).join(", ");
    return <h1>XP for {csv}</h1>;
}