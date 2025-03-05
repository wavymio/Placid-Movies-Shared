import React from 'react'

const Birds = () => {
    return (
        <>
            <g id="birds">
                {/* <!-- Bird 1 (Flying Left to Right) --> */}
                <path d="M-500,-500 Q-490,-510 -480,-500 Q-470,-490 -460,-500" 
                    stroke="white" fill="none" strokeWidth="10">
                    <animate attributeName="stroke" values="white; red; white" dur="2s" repeatCount="indefinite"/>
                    <animateTransform 
                        attributeName="transform" 
                        type="translate" 
                        // from="-2000 0" to="12000 0" 
                        values="-2000 0; 4000 -500; 8000 100; 12000 0; -2000 0" 
                        dur="1000s" 
                        repeatCount="indefinite"/>
                </path>
            </g>

            <defs>
                {/* <!-- Define the circular motion paths --> */}
                <path id="circularPath" d="M 100,0 A 100,100 0 1,1 -100,0 A 100,100 0 1,1 100,0" fill="none"/>
                <path id="circularPath2" d="M 200,0 A 200,200 0 1,1 -200,0 A 200,200 0 1,1 200,0" fill="none"/>
                <path id="circularPath3" d="M 300,0 A 300,300 0 1,1 -300,0 A 300,300 0 1,1 300,0" fill="none"/>
            </defs>
            <g>
                {/* <!-- First bird --> */}
                <path d="M10,0 Q20,-10 30,0 Q40,10 50,0" stroke="black" fill="none" strokeWidth="2">
                    <animateMotion repeatCount="indefinite" dur="5s" rotate="auto">
                        <mpath href="#circularPath"/>
                    </animateMotion>
                </path>

                {/* <!-- Second bird --> */}
                <path d="M10,0 Q20,-10 30,0 Q40,10 50,0" stroke="black" fill="none" strokeWidth="2">
                    <animateMotion repeatCount="indefinite" dur="7s" rotate="auto">
                        <mpath href="#circularPath2"/>
                    </animateMotion>
                </path>
                <path d="M10,0 Q20,-10 30,0 Q40,10 50,0" stroke="black" fill="none" strokeWidth="2">
                    <animateMotion repeatCount="indefinite" dur="12s" rotate="auto">
                        <mpath href="#circularPath2"/>
                    </animateMotion>
                </path>

                <path d="M10,0 Q20,-10 30,0 Q40,10 50,0" stroke="black" fill="none" strokeWidth="2">
                    <animateMotion repeatCount="indefinite" dur="9s" rotate="auto">
                        <mpath href="#circularPath3"/>
                    </animateMotion>
                </path>
            </g>

            <defs>
                {/* <!-- Motion paths over different continents --> */}
                <path id="africaPath" d="M 300,400 A 80,80 0 1,1 220,400 A 80,80 0 1,1 300,400" fill="none"/>
                <path id="asiaPath" d="M 800,200 A 100,100 0 1,1 700,200 A 100,100 0 1,1 800,200" fill="none"/>
                <path id="southAmericaPath" d="M 200,600 A 90,90 0 1,1 110,600 A 90,90 0 1,1 200,600" fill="none"/>
            </defs>

            <g>
                {/* <!-- Bird hovering over Africa --> */}
                <path d="M10,0 Q20,-10 30,0 Q40,10 50,0" stroke="black" fill="none" strokeWidth="2">
                    <animateMotion repeatCount="indefinite" dur="6s" rotate="auto">
                        <mpath href="#africaPath"/>
                    </animateMotion>
                </path>

                {/* <!-- Bird hovering over Asia --> */}
                <path d="M10,0 Q20,-10 30,0 Q40,10 50,0" stroke="black" fill="none" strokeWidth="2">
                    <animateMotion repeatCount="indefinite" dur="7s" rotate="auto">
                        <mpath href="#asiaPath"/>
                    </animateMotion>
                </path>

                {/* <!-- Bird hovering over South America --> */}
                <path d="M10,0 Q20,-10 30,0 Q40,10 50,0" stroke="black" fill="none" strokeWidth="2">
                    <animateMotion repeatCount="indefinite" dur="5s" rotate="auto">
                        <mpath href="#southAmericaPath"/>
                    </animateMotion>
                </path>
            </g>
        </>
    )
}

export default Birds
