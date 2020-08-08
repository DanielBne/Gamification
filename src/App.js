import React from "react";
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
      .api(`query { boards(ids:[${boardIds}]) { id, items { id, name, column_values { type, id, text } } }}`)
      .then((res) => { this.setState({ boards: res.data.boards });
        // , () => {
        //   console.log(res.data.boards[0].items.slice(0, 10).map((item) => item.id));
        // });
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
      <div className="App">
        <Leaderboard settings={this.state.settings} />
      </div>
    );
  }
}

export default App;