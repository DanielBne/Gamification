import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import { ScoreCard } from "./components/ScoreCard";
const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      settings: {},
      context: {},
      boards: [],
      name: "",
    };
  }

  componentDidMount() {
    monday.listen("settings", this.getSettings);
    monday.listen("context", this.getContext);
    monday.listen("itemIds", this.getItemIds);
  }

  getSettings = (res) => {
    this.setState({ settings: res.data });
    console.log("settings!", res.data);
    this.generateWords();
  };

  getItemIds = (res) => {
    const itemIds = {};
    res.data.forEach((id) => (itemIds[id] = true));
    this.setState({ itemIds: itemIds });
    this.generateWords();
  };

  getContext = (res) => {
    const context = res.data;
    console.log("context!", context);
    this.setState({ context });

    const boardIds = context.boardIds || [context.boardId];
    monday
      .api(`query { boards(ids:[${boardIds}]) { id, items { id, name, column_values { id, text } } }}`)
      .then((res) => {
        this.setState({ boards: res.data.boards }, () => {
          console.log(res.data.boards[0].items.slice(0, 10).map((item) => item.id));
        });
      });
  };

  render() {
    const users = this.state.settings.users;

    return (
      <div className="App">

        <h1>{this.state.settings.title}</h1>

        <div>{JSON.stringify(this.state.boards, null, 2)}</div>

        <div class="scorecards">
          {users && users.teammates.map((user) =>
            <ScoreCard key={user} user={user} />
          )}
        </div>
      </div>
    );
  }
}

export default App;