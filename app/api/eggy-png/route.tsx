import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "64px",
        }}
      >
        <svg
          width="460"
          height="460"
          viewBox="-20 0 160 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(20, 10)">
            {/* Egg body */}
            <path
              d="M50 5 C 25 5, 5 35, 5 70 C 5 105, 25 115, 50 115 C 75 115, 95 105, 95 70 C 95 35, 75 5, 50 5 Z"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="3"
            />
            {/* Chef hat */}
            <g transform="translate(0, -15)">
              <path
                d="M20 15 C 20 0, 40 -10, 50 5 C 60 -10, 80 0, 80 15 L 80 25 L 20 25 Z"
                fill="#FFF"
                stroke="#000"
                strokeWidth="3"
              />
              <rect
                x="22"
                y="25"
                width="56"
                height="10"
                fill="#FBBF24"
                stroke="#000"
                strokeWidth="3"
              />
            </g>
            {/* Face */}
            <g transform="translate(0, 15)">
              <circle cx="35" cy="50" r="3" fill="#000" />
              <circle cx="65" cy="50" r="3" fill="#000" />
              <path
                d="M40 60 Q 50 70 60 60"
                stroke="#000"
                strokeWidth="2"
                fill="none"
              />
              <path d="M52 65 Q 55 75 58 65" fill="#EF4444" />
            </g>
            {/* Left arm with whisk */}
            <g transform="translate(-10, 50)">
              <path
                d="M10 20 L -10 10"
                stroke="#000"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <g transform="translate(-25, -10) rotate(-15)">
                <path d="M10 0 L 10 20" stroke="#666" strokeWidth="3" />
                <ellipse
                  cx="10"
                  cy="-10"
                  rx="8"
                  ry="12"
                  stroke="#666"
                  strokeWidth="2"
                  fill="none"
                />
                <ellipse
                  cx="10"
                  cy="-10"
                  rx="4"
                  ry="10"
                  stroke="#666"
                  strokeWidth="2"
                  fill="none"
                />
              </g>
            </g>
            {/* Right arm with pan */}
            <g transform="translate(90, 60)">
              <path
                d="M-5 10 L 15 20"
                stroke="#000"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M0 0 L 30 0 C 30 15, 15 25, 0 25 C -15 25, -30 15, -30 0 Z"
                fill="#A8A29E"
                stroke="#000"
                strokeWidth="3"
              />
              <path d="M-25 2 Q 0 10 25 2" fill="#FCD34D" />
            </g>
          </g>
        </svg>
      </div>
    ),
    {
      width: 512,
      height: 512,
    },
  );
}
