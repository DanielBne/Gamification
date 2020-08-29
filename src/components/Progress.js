import React from "react";
import "./Progress.css";

export class Progress extends React.Component {
    render() {
		const percent = this.props.percent;
        return (
            <div className="progress">
                {this.props.message && <span>{this.props.message}</span>}
                {this.props.messageLeft &&
                    <span>
                        <span className="left">{this.props.messageLeft}</span>
                        <span className="right">{this.props.messageRight}</span>
                    </span>}
				<div className="current shiny" style={{width: `${percent}%`}}></div>
            </div>
        );
	}
}