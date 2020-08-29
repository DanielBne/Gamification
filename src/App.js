import React from "react";
import "./mondayStyles.css";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import { Leaderboard } from "./components/Leaderboard";
const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      settings: {},
      context: {},
      boards: [],
      users: [],
      name: "",
    };
  }

  // called when the component is mounted into the DOM. Right before Render.
  componentDidMount() {
    monday.listen("settings", this.getSettings);
    monday.listen("context", this.getContext);
    monday.listen("events", this.onChange);
    this.getUsers();
  }

  getSettings = (res) => {
    this.setState({ settings: res.data });
  };

  getContext = (res) => {
    const context = res.data;
    console.debug("context!", context);
    this.setState({ context: context });

    this.getBoardData();
  };

  /**
   * Reloads board data, which is the data we used to calculate XP
   */
  getBoardData = () => {
    const boardIds = this.state.context.boardIds || [this.state.context.boardId];
    monday
      .api(`query { boards(ids:[${boardIds}]) { id, name, items { id, name, column_values { type, id, text } } }}`)
      .then((res) => { 
        this.setState({ boards: res.data.boards });
      });
  }

  /**
   * Like board data, we need user data to show xp values.
   */
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

  /**
   * Detects client side changes (Seems to be for split view?) and refreshes the board.
   */
  onChange = (res) => {
    // When an item/s are created on the board:
    // => { type: "new_items", itemIds: [5543, 5544, 5545], boardId: 3425 }

    // When a column value changes for one of the items:
    // => { type: "change_column_value", itemId: 12342, value: {...} }
    console.debug("onChanged", res);
    this.getBoardData();
  }

  render() {
    // Every property specified in component becomes a property of Leaverbord.props
    return (
      // TODO: Support dark theme
      <div className="App light-app-theme">
        <Leaderboard settings={this.state.settings} boards={this.state.boards} users={this.state.users} />
      </div>
    );
  }
}

export default App;