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
                    return {
                        id : user.id,
                        name : user.name,
                        title : user.title || "",
                        level : 0,
                        xp: 0,
                        profilePic : user.photo_thumb_small
                    }
                });

                this.setState({ users: users });
            });
    }

    render() {
        const users = this.state.users;

        try {
            const message = this.calculateXP();
            if(!message) {
                return (
                    <div className="Leaderboard">
                        <h1>{this.props.settings.title}</h1>
                        <div className="scorecards">
                            {users && users.map((user) =>
                                <ScoreCard key={user.id} user={user} />
                            )}
                        </div>
                    </div>
                );
            }
            else {
                return (
                    <div className="Leaderboard">
                        <h1>{this.props.settings.title}</h1>
                        <div className="scorecards">{message}</div>
                    </div>
                );
            }            
        }
        catch(e) {
            console.log(e);
            return (
                <div className="Leaderboard">
                    <h1>{this.props.settings.title}</h1>
                    <div className="scorecards">
                        <Error whatFailed="determine XP" message={e.message || e} />
                    </div>
                </div>
            );            
        }
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

// ScoreCard.defaultProps = {
//     user: {}
// };