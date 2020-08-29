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
      name: "",
    };
  }

  // called when the component is mounted into the DOM. Right before Render.
  componentDidMount() {
    monday.listen("settings", this.getSettings);
    monday.listen("context", this.getContext);
    monday.listen("itemIds", this.getItemIds);
  }

  getSettings = (res) => {
    this.setState({ settings: res.data });
  };

  // data
  getContext = (res) => {
    const context = res.data;
    console.log("context!", context);
    this.setState({ context });

    const boardIds = context.boardIds || [context.boardId];
    monday
      .api(`query { boards(ids:[${boardIds}]) { id, name, items { id, name, column_values { type, id, text } } }}`)
      .then((res) => { 
        this.setState({ boards: res.data.boards });
      });
  };

  getItemIds = (res) => {
    const itemIds = {};
    res.data.forEach((id) => (itemIds[id] = true));
    this.setState({ itemIds: itemIds });
  };

  render() {
     // Every property specified in component becomes a property of Leaverbord.props
    return (
      // TODO: Support dark theme
      <div className="App light-app-theme">
        <Leaderboard settings={this.state.settings} boards={this.state.boards} />
      </div>
    );
  }
}

export default App;