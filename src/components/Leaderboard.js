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
            .api(`query { users { id, name, title, photo_tiny } }`)
            .then((res) => { 
                this.setState({ users: res.data.users }); 
            });
    };

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