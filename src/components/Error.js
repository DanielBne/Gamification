import React from "react";

/**
 * Outputs an error span
 * @param {*} props Expects .whatFailed and .message to output string "Failed to {whatFailed} with error: {message}""
 */
export function Error(props) {
	const whatFailed = props.whatFailed || "render page";
	const message = props.message || props.msg || props;
	return <span className='error'>Failed to {whatFailed} with error: "{message}"</span>;
}