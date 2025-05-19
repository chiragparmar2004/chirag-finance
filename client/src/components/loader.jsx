
const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <style>
        {`
          @keyframes blinkCursor {
            0%, 100% {
              border-color: transparent;
            }
            50% {
              border-color: #22c55e;
            }
          }

          @keyframes typeAndDelete {
            0%, 10% {
              width: 0ch;
            }
            45%, 55% {
              width: 22ch;
            }
            90%, 100% {
              width: 0ch;
            }
          }

          .typing {
            overflow: hidden;
            white-space: nowrap;
            border-right: 2px solid #22c55e;
            animation:
              typeAndDelete 4s steps(22) infinite,
              blinkCursor 0.7s step-end infinite;
          }
        `}
      </style>

      <div className="bg-[#1e1e1e] w-[350px] sm:w-[400px] h-[200px] rounded-lg shadow-xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-center relative bg-[#2d2d2d] py-2 px-4 rounded-t-lg">
          <div className="absolute left-3 flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
          </div>
          <p className="text-gray-300 text-sm font-medium">Server Status</p>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-green-500 font-mono font-semibold text-base typing">
            Server is Starting ...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
