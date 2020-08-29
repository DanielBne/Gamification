import React from "react";
import "./Progress.css";


export class Progress extends React.Component {
    render() {
		const percent = this.props.percent;
        return (
            <div className="progress">
				<span>{this.props.message}</span>
				<div class="current shiny" style={{width: percent}}></div>
            </div>
        );
	}
}