import React from "react";

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#000", // optional, adds background color
      }}
    >
      <style>
        {`
          @keyframes blinkCursor {
            50% {
              border-right-color: transparent;
            }
          }

         @keyframes typeAndDelete {
            0%,
            10% {
              width: 0;
            }

            45%,
            55% {
              width: 9em; /* Adjust this to fit the entire text */
            }

            90%,
            100% {
              width: 0;
            }
          }


          .terminal-loader {
            width: 100%;
            max-width: 400px;
            height: 200px;
            background: #1c1c1c;
            border: 1px solid #ffffff3e;
            border-radius: 10px;
            overflow: hidden;
            margin: 20px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
          }

          .terminal-header {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #343434;
            padding: 6px;
          }

          .terminal-controls {
            position: absolute;
            left: 10px;
            display: flex;
            gap: 7px;
          }

          .control {
            display: inline-block;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background-color: #777;
          }

          .control.close {
            background-color: #e33;
          }

          .control.minimize {
            background-color: #ee0;
          }

          .control.maximize {
            background-color: #0b0;
          }

          .terminal-title {
            color: #eeeeeec1;
          }

          .content {
            padding: 10px;
          }

          .text {
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            border-right: 2px solid green;
            animation: typeAndDelete 4s steps(11) infinite,
              blinkCursor 0.5s step-end infinite alternate;
            color: rgb(0, 196, 0);
            font-weight: 600;
          }
        `}
      </style>
      <div className="terminal-loader">
        <div className="terminal-header">
          <div className="terminal-title">Server Status</div>
          <div className="terminal-controls">
            <div className="control close"></div>
            <div className="control minimize"></div>
            <div className="control maximize"></div>
          </div>
        </div>
        <div className="content">
          <div className="text">Server is Starting ...</div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
