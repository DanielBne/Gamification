import React from "react";
import { ScoreCard } from "./ScoreCard";
import mondaySdk from "monday-sdk-js";
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
                        title : user.title || "No Title",
                        level : 3,
                        profilePic : user.photo_thumb_small
                    }
                });

                this.setState({ users: users });
            });
    }

    render() {
        const users = this.state.users;

        return (
            <div class="Leaderboard">

                <h1>{this.props.settings.title}</h1>

                {/* <div>{JSON.stringify(this.props.boards, null, 2)}</div> */}

                <div class="scorecards">
                    {users && users.map((user) =>
                        <ScoreCard user={user} />
                    )}
                </div>
            </div>
        );
    }
}

// ScoreCard.defaultProps = {
//     user: {}
// };