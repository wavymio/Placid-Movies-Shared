import ContinentsGradients from '../components/ContinentsGradients'
import Birds from '../components/Birds'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import { countryColour, countryColour2, handleZoomStop } from './Continent'

export const continents = [
    { 
        id: 1,
        name: "Eldoria", gradientId: "eldoriaGradient", sand: "#E5C07B", 
        path: "M160,440 L180,445 L200,430 L210,450 L205,470 L180,490 L160,485 L140,470 L135,455 L150,445 Z",
        scale: 5,
        seaColor: "#0169a4",
        dx: -3800, dy: -10450,
        countries: [
            { 
                id: 24, name: "Xalvador", 
                path: "M340,320 L370,330 L390,350 L410,340 L430,360 L420,380 L400,390 L370,410 L350,420 L330,400 L320,380 Z",
                dx: -5050, dy: -5900, scale: 20, 
                fill: countryColour2, stroke: "",
                zoomScale: 4
            },
            { 
                id: 25, name: "Rastorira", 
                path: "M220,310 L250,300 L280,320 L310,340 L330,360 L350,370 L340,390 L320,400 L290,410 L260,400 L230,390 L210,370 Z",
                dx: -4400, dy: -4000, scale: 18, 
                fill: countryColour2, stroke: "",
                zoomScale: 3.5
            },
            { 
                id: 26, name: "Yndor", 
                path: "M450,290 L480,300 L500,320 L520,350 L530,370 L520,390 L500,400 L470,410 L440,400 L420,380 L410,350 L420,320 Z",
                dx: -8050, dy: -3500, scale: 14, 
                fill: countryColour2, stroke: "",
                zoomScale: 4
            },
            { 
                id: 30, name: "Manalysia", 
                path: "M90,520 L130,530 L160,550 L180,580 L190,610 L170,640 L140,660 L110,650 L80,630 L60,600 L70,570 L80,540 Z",
                dx: 2000, dy: -5700, scale: 10, 
                fill: countryColour2, stroke: "",
                zoomScale: 5
            },
            { 
                id: 27, name: "Vampiria", 
                path: "M500,200 L530,220 L550,250 L570,260 L590,290 L580,320 L560,340 L530,330 L510,350 L480,340 L470,310 L460,280 L470,250 Z",
                dx: -2200, dy: -4100, scale: 10, 
                fill: countryColour2, stroke: "",
                zoomScale: 3
            },
            { 
                id: 28, name: "Qenara", 
                path: "M150,450 L180,460 L210,480 L230,510 L250,530 L260,560 L250,580 L220,590 L200,570 L180,560 L160,540 L140,520 L130,490 L140,470 Z",
                dx: -100, dy: -5500, scale: 10, 
                fill: countryColour2, stroke: "",
                zoomScale: 6
            },
            { 
                id: 29, name: "Dravon", 
                path: "M600,420 L630,430 L660,450 L690,460 L700,490 L690,520 L670,540 L640,550 L620,530 L590,520 L570,500 L560,470 L570,440 Z",
                dx: -5300, dy: -3500, scale: 9, 
                fill: countryColour2, stroke: "",
                zoomScale: 7
            },
            { 
                id: 31, name: "Norvith", 
                path: "M300,600 L330,610 L350,640 L370,660 L390,690 L370,720 L340,740 L310,750 L280,730 L270,700 L260,670 L280,640 L290,620 Z",
                dx: -3500, dy: -4700, scale: 7, 
                fill: countryColour2, stroke: "",
                zoomScale: 5
            },
            { 
                id: 32, name: "Caldris", 
                path: "M700,100 L740,120 L760,150 L770,180 L780,200 L770,230 L750,250 L720,260 L690,250 L670,230 L660,200 L670,170 L680,140 Z",
                dx: -5800, dy: -500, scale: 4, 
                fill: countryColour2, stroke: "",
                zoomScale: 7
            },
            { 
                id: 33, name: "Orynthia", 
                path: "M400,500 L430,510 L460,530 L490,540 L500,570 L490,600 L470,620 L440,630 L410,620 L390,600 L380,570 L390,540 L370,520 Z",
                dx: -5000, dy: -6700, scale: 11, 
                fill: countryColour2, stroke: "",
                zoomScale: 4
            },
        ],
        naturalResources: [],
        averageTemp: 0,
        
    },
    { 
        id: 2,
        name: "Vastara", gradientId: "vastaraGradient", sand: "#D2B48C",
        path: "M320,90 L390,110 L430,160 L440,220 L410,270 L350,280 L290,240 L300,150 Z", // Irregular Octagon
        scale: 2.5,
        seaColor: "#036298",
        dx: 800, dy: -2250,
        countries: [],
        naturalResources: [],
        averageTemp: 0,
         
    },
    { 
        id: 3,
        name: "Oceania", gradientId: "oceaniaGradient", sand: "#CDAA6D",
        path: "M580,210 L630,240 L680,280 L700,340 L680,390 L630,420 L570,400 L530,340 L550,270 Z", // Irregular Nonagon
        scale: 5,
        seaColor: "#036093",
        dx: -4750, dy: -2000,
        timeZoneOffset: 1,
        countries: [{ 
            id: 1, name: "Tavros", 
            path: "M180,380 L210,390 L230,410 L240,430 L230,450 L210,470 L190,480 L160,470 L140,450 L150,420 L160,400 Z",
            dx: -2250, dy: -3700, scale: 17, 
            fill: countryColour, stroke: "",
            largeDx: -10250, largeDy: -24900,
            largeScale: 60, largeFill: '',
            surroundingColor: 'linear-gradient(to bottom, #2b8c77, #2d8b5d, #57935c, #98a066, #cdaa6d 100%)',
            timeZoneOffset: 1,
            cities: [
                {
                    id: 1, name: "Vardania",
                    path: "M600,300 L640,310 L670,330 L690,360 L680,390 L660,420 L630,440 L600,450 L570,440 L540,420 L520,390 L530,360 L550,340 L580,320 Z",
                    dx: -2400, dy: -3500, scale: 5,
                    fill: countryColour, stroke: "",
                    zoomScale: 6, largeDx: 0, largeDy: 0,
                    largeFill: 0,
                    surroundingColor: 'linear-gradient(to bottom, #2d8c66, #2c8b61, #2d8b5d)',
                    timeZoneOffset: 1,
                },
                {
                    id: 2, name: "Norgrad",
                    path: "M850,500 L880,510 L910,530 L930,560 L920,580 L900,590 L880,610 L860,600 L840,610 L820,600 L810,580 L820,550 L830,530 Z",
                    dx: -9000, dy: -3300, scale: 9,
                    fill: countryColour, stroke: "",
                    zoomScale: 6, largeDx: 0, largeDy: 0,
                    largeFill: 0,
                    surroundingColor: 'linear-gradient(to bottom, #62955e, #729860, #829b62)',
                    timeZoneOffset: 1,
                },
                {
                    id: 3, name: "Zargovia",
                    path: "M500,700 L530,710 L560,730 L570,760 L560,780 L540,800 L510,810 L480,800 L450,780 L440,750 L450,720 L470,710 Z",
                    dx: -1700, dy: -6700, scale: 10,
                    fill: countryColour, stroke: "",
                    zoomScale: 6, largeDx: 0, largeDy: 0,
                    largeFill: 0,
                    surroundingColor: 'linear-gradient(to bottom, #4e915c, #55925c, #60945d, #69965f)',
                    timeZoneOffset: 1,
                }
            ]
        },
        { 
            id: 2, name: "Borith", 
            path: "M250,460 L270,470 L300,480 L320,500 L310,520 L290,530 L260,540 L240,530 L230,500 L240,480 L245,470 Z",
            dx: -8490, dy: -14000, scale: 29,
            fill: countryColour, stroke: "",
            largeDx: -20000, largeDy: -37000,
            largeScale: 75, largeFill: '',
            surroundingColor: 'linear-gradient(to bottom, #188bf2 20%, #268da4 80%)',
            timeZoneOffset: 0,
        },
        { 
            id: 3, name: "Geldar", 
            path: "M100,520 L130,530 L160,540 L180,560 L170,580 L150,590 L120,580 L90,570 L80,550 L85,530 L95,525 Z",
            dx: -1820, dy: -14300, scale: 29,
            fill: countryColour, stroke: "",
            largeDx: -8500, largeDy: -38300,
            largeScale: 70, largeFill: '',
            surroundingColor: 'linear-gradient(to bottom, #208fe7, #258db3, #2a8c82, #2c8b63)',
            timeZoneOffset: 2,
        },
        { 
            id: 4, name: "Zephyria", 
            path: "M290,410 L320,420 L340,440 L350,460 L340,480 L320,500 L300,510 L280,500 L260,480 L270,450 L280,430 Z",
            dx: -6450, dy: -10650, scale: 20, 
            fill: countryColour, stroke: "",
            largeDx: -20600, largeDy: -31350,
            largeScale: 70, largeFill: '',
            surroundingColor: 'linear-gradient(to bottom, #A9A9A9 10%, #0077BE 90%)',
            timeZoneOffset: 1,
        },
        { 
            id: 5, name: "Morvath", 
            path: "M140,580 L170,590 L200,600 L210,620 L190,640 L160,650 L130,640 L100,620 L110,600 L120,590 L130,585 Z",
            dx: -3850, dy: -10400, scale: 21,
            fill: countryColour, stroke: "",
            largeDx: -10200, largeDy: -43000,
            largeScale: 72, largeFill: '',
            surroundingColor: 'linear-gradient(to bottom, #248db5, #278d99, #2e8b59)',
            timeZoneOffset: 0,
        },
        { 
            id: 6, name: "Vexora", 
            path: "M220,350 L250,360 L270,380 L280,400 L270,420 L250,440 L230,450 L200,440 L180,420 L190,390 L200,370 Z",
            dx: -2150, dy: -6600, scale: 16, 
            fill: countryColour, stroke: "",
            largeDx: -14500, largeDy: -25600,
            largeScale: 66, largeFill: '',
            surroundingColor: 'linear-gradient(to bottom, #0077BE, #0077BE)',
            timeZoneOffset: 2,
        }],
        naturalResources: [],
        averageTemp: 0,
         
    },
    { 
        id: 4,
        name: "Zentara", gradientId: "zentaraGradient", sand: "#A68A64", 
        path: "M120,660 L150,670 L180,680 L200,700 L190,720 L160,730 L130,720 L100,710 L90,690 L100,670 L110,665 Z",
        scale: 3.5,
        seaColor: "#045a87",
        dx: -1800, dy: -13500,
        countries: [
            { 
                id: 34, name: "Slauv", 
                path: "M100,200 L140,210 L170,230 L190,260 L180,290 L160,310 L130,320 L110,300 L80,280 L70,250 L80,220 Z",
                dx: -3750, dy: -2000, scale: 12, 
                fill: countryColour, stroke: '',
                zoomScale: 5
            },
            {
                id: 35, name: "Torshavn",
                path: "M400,180 L440,190 L470,210 L490,240 L480,270 L460,290 L430,310 L400,320 L370,310 L340,290 L330,260 L340,230 L360,210 Z",
                dx: -4900, dy: -1600, scale: 6,
                fill: countryColour, stroke: '',
                zoomScale: 7
            },
            { 
                id: 36, name: "Brithan", 
                path: "M200,350 L240,360 L270,380 L290,400 L280,430 L260,450 L230,460 L200,450 L170,430 L160,400 L170,370 Z",
                dx: -3200, dy: -5200, scale: 10, 
                fill: countryColour, stroke: '',
                zoomScale: 6
            },
            { 
                id: 37, name: "Galdoria", 
                path: "M500,500 L540,520 L570,540 L590,570 L580,600 L560,620 L530,630 L500,620 L470,600 L460,570 L470,540 Z",
                dx: -7400, dy: -6650, scale: 12, 
                fill: countryColour, stroke: '',
                zoomScale: 5
            },
            { 
                id: 38, name: "Kravenholm", 
                path: "M700,100 L740,120 L770,150 L780,180 L770,210 L750,230 L720,240 L690,220 L670,200 L660,170 L670,140 Z",
                dx: -5600, dy: -1700, scale: 5, 
                fill: countryColour, stroke: '',
                zoomScale: 8
            },
            { 
                id: 39, name: "Svalterra", 
                path: "M300,600 L340,620 L360,650 L370,680 L360,710 L340,730 L310,740 L280,720 L270,690 L260,660 L270,630 L280,610 Z",
                dx: -1800, dy: -3350, scale: 2, 
                fill: '#E5C07B', stroke: '',
                island: true, zoomScale: 16
            },
            { 
                id: 40, name: "Velmora", 
                path: "M50,500 L90,510 L120,530 L140,550 L150,580 L140,610 L120,630 L90,640 L60,630 L40,600 L30,570 L40,540 Z",
                dx: 3000, dy: 800, scale: 4.5, 
                fill: '#006400', stroke: '',
                island: true, zoomScale: 10
            },
            { 
                id: 41, name: "Nythoria", 
                path: "M500,300 L530,310 L550,330 L560,360 L550,390 L530,410 L500,420 L470,410 L450,390 L440,360 L450,330 L470,310 Z",
                dx: -4700, dy: -4200, scale: 10, 
                fill: countryColour, stroke: '',
                zoomScale: 5
            },
            { 
                id: 42, name: "Orlannis", 
                path: "M600,420 L630,430 L660,450 L690,460 L700,490 L690,520 L670,540 L640,550 L620,530 L590,520 L570,500 L560,470 L570,440 Z",
                dx: -9300, dy: -6500, scale: 16, 
                fill: countryColour, stroke: '',
                zoomScale: 4
            },
            { 
                id: 43, name: "Jovareth", 
                path: "M700,600 L740,620 L770,640 L790,670 L780,700 L750,720 L720,730 L690,720 L670,700 L660,670 L670,640 Z",
                dx: -7400, dy: -4300, scale: 9, 
                fill: countryColour, stroke: '',
                zoomScale: 5
            },
            { 
                id: 44, name: "Zerathis", 
                path: "M200,100 L240,120 L260,150 L270,180 L260,210 L240,230 L210,240 L180,230 L150,210 L140,180 L150,150 Z",
                dx: -600, dy: 1600, scale: 4.5, 
                fill: countryColour, stroke: '',
                zoomScale: 7
            },
            { 
                id: 45, name: "Solmaria", 
                path: "M350,300 L380,310 L400,330 L420,350 L430,380 L420,410 L400,430 L370,440 L340,420 L320,400 L310,370 L320,340 Z",
                dx: -2200, dy: -3800, scale: 10, 
                fill: countryColour, stroke: '',
                zoomScale: 5.5
            },
            { 
                id: 46, name: "Yverness", 
                path: "M250,450 L280,460 L310,480 L330,500 L340,530 L330,560 L310,580 L280,590 L250,580 L230,560 L220,530 L230,500 Z",
                dx: -1350, dy: -6100, scale: 15, 
                fill: countryColour, stroke: '',
                zoomScale: 3.5
            },
            { 
                id: 47, name: "Falcrest", 
                path: "M800,200 L840,220 L860,250 L870,280 L860,310 L840,330 L810,340 L780,320 L770,290 L760,260 L770,230 Z",
                dx: -4350, dy: 650, scale: 7.5, 
                fill: countryColour, stroke: '',
                zoomScale: 6
            },
            { 
                id: 48, name: "Borgenthia", 
                path: "M600,500 L630,510 L660,530 L680,550 L690,580 L680,610 L660,630 L630,640 L600,630 L570,610 L560,580 L570,550 Z",
                dx: -2250, dy: -4450, scale: 8, 
                fill: countryColour, stroke: '',
                zoomScale: 6
            },
            {
                id: 49, name: "Drevania",
                path: "M750,400 L790,410 L820,430 L840,460 L830,490 L810,520 L780,540 L750,550 L720,540 L690,520 L670,490 L680,460 L700,440 L730,420 Z",
                dx: 1000, dy: -750, scale: 4,
                fill: countryColour, stroke: '',
                zoomScale: 8
            },
        ],
        naturalResources: [],
        averageTemp: 0,
         
    },
    { 
        id: 5,
        name: "Mythos", gradientId: "mythosGradient", sand: "#E5C07B",
        path: "M490,420 L560,450 L590,500 L600,550 L580,580 L530,600 L480,580 L450,530 L460,470 Z", // Jagged Nonagon
        scale: 5,
        seaColor: "#093848",
        dx: 3350, dy: 3350,
        countries: [],
        naturalResources: [],
        averageTemp: 0,
        
    },
    { 
        id: 6,
        name: "Titanis", gradientId: "titanisGradient", sand: "#D2B48C",
        path: "M110,410 L160,440 L210,460 L250,500 L240,540 L190,570 L130,550 L90,510 L100,470 Z", // Different Nonagon
        scale: 2.0,
        seaColor: "linear-gradient(to bottom, #034B72, #0A2E36)",
        dx: -5050, dy: -8500,
        countries: [
            { 
                id: 1, name: "Eldan", 
                path: "M120,420 L140,425 L180,440 L200,455 L210,470 L190,485 L170,500 L140,495 L110,480 L115,450 L120,435 Z",
                dx: -2750, dy: -5450, scale: 20, 
                fill: countryColour, stroke: "",
                zoomScale: 4
            },
            { 
                id: 2, name: "Vornar", 
                path: "M200,430 L225,440 L250,460 L265,470 L270,490 L250,500 L220,510 L200,505 L180,490 L185,460 L195,445 Z",
                dx: -8100, dy: -15600, scale: 30,
                fill: countryColour, stroke: "",
                zoomScale: 3
            },
            { 
                id: 3, name: "Zeroth", 
                path: "M300,450 L320,460 L340,470 L350,490 L330,510 L310,520 L290,530 L270,515 L260,495 L270,490 L280,470 Z",
                dx: -5950, dy: -13000, scale: 30,
                fill: countryColour, stroke: "",
                zoomScale: 3
            },
            { 
                id: 4, name: "Mythara", 
                path: "M220,510 L250,505 L270,490 L290,505 L290,530 L270,540 L250,550 L230,545 L210,530 L215,520 L220,515 Z",
                dx: -8850, dy: -15200, scale: 30, 
                fill: countryColour, stroke: "",
                zoomScale: 4
            },
            { 
                id: 5, name: "Xendar", 
                path: "M130,550 L150,560 L190,570 L210,580 L220,600 L200,610 L170,620 L140,610 L120,600 L125,575 L130,560 Z",
                dx: -2450, dy: -12400, scale: 20,
                fill: countryColour, stroke: "",
                zoomScale: 4
            },
            { 
                id: 6, name: "Thalios", 
                path: "M240,540 L260,545 L280,550 L300,565 L310,580 L300,595 L280,600 L260,595 L250,590 L245,570 L240,550 Z",
                dx: -5350, dy: -12000, scale: 22,
                fill: countryColour, stroke: "",
                zoomScale: 5
            },
            { 
                id: 7, name: "Kryth", 
                path: "M90,510 L110,520 L130,550 L125,570 L120,600 L100,590 L80,570 L75,550 L70,530 L80,520 Z",
                dx: -2050, dy: -9350, scale: 20,
                fill: countryColour, stroke: "",
                zoomScale: 4
            },
            { 
                id: 8, name: "Norath", 
                path: "M100,470 L110,485 L90,510 L80,520 L70,530 L60,520 L50,500 L55,480 L60,490 L80,460 L90,455 Z",
                dx: -3750, dy: -12400, scale: 30, 
                fill: countryColour, stroke: "",
                zoomScale: 3
            },
            { 
                id: 9, name: "Solmara", 
                path: "M160,440 L180,445 L200,430 L210,450 L205,470 L180,490 L160,485 L140,470 L135,455 L150,445 Z",
                dx: -1450, dy: -5800, scale: 20.2,
                fill: countryColour, stroke: "",
                zoomScale: 5
            },
            { 
                id: 10, name: "Drakar", 
                path: "M250,500 L270,510 L290,530 L285,540 L270,550 L250,560 L230,550 L220,530 L225,520 L240,510 Z",
                dx: -3850, dy: -8400, scale: 20,
                fill: countryColour, stroke: "",
                zoomScale: 5
            },
            { 
                id: 11, name: "Velmora", 
                path: "M280,420 L310,430 L330,450 L340,470 L330,490 L310,500 L290,510 L270,500 L250,480 L260,450 L270,430 Z",
                dx: -450, dy: 1200, scale: 7, 
                fill: countryColour, stroke: "",
                zoomScale: 6
            },
            { 
                id: 12, name: "Durnak", 
                path: "M150,480 L170,490 L190,500 L210,520 L220,540 L200,550 L180,560 L160,550 L140,530 L135,500 L140,490 Z",
                dx: -5050, dy: -6200, scale: 14.5,
                fill: countryColour, stroke: "",
                zoomScale: 6
            },
            { 
                id: 13, name: "Zaldris", 
                path: "M350,500 L380,510 L400,530 L390,550 L370,570 L350,580 L330,570 L310,550 L300,530 L320,510 L330,500 Z",
                dx: -2450, dy: -6750, scale: 13,
                fill: countryColour, stroke: "",
                zoomScale: 5
            }
        ],
        naturalResources: [],
        averageTemp: 0,
         
    }, 
    {
        id: 7,
        name: "Lunaria", gradientId: "lunariaGradient", sand: "#CDAA6D",
        path: "M260,320 L290,330 L310,350 L320,370 L310,390 L290,410 L270,420 L240,410 L220,390 L230,360 L240,340 Z",
        scale: 3.5,
        seaColor: "#016faf",
        dx: -2900, dy: -8250,
        countries: [],
        naturalResources: [],
        averageTemp: 0,
        
    },
    
]

export const scaleAndMovePath = (path, scaleFactor, dx, dy) => {
    return path.replace(/([ML])([0-9.-]+),([0-9.-]+)/g, (match, command, x, y) => {
      const newX = parseFloat(x) * scaleFactor + dx
      const newY = parseFloat(y) * scaleFactor + dy
      return `${command}${newX},${newY}`
    })
}

export const updateDimensions = (ref, setDimensions) => {
    if (ref.current) {
        return setDimensions({
            width: ref.current.clientWidth,
            height: ref.current.clientHeight,
        })
    }
    console.log("New Dimensions: ", {
        width: ref.current.clientWidth,
        height: ref.current.clientHeight,
    })
}

const SocietyMap = () => {
    const navigate = useNavigate()
    const containerRef = useRef(null)
    const transformRef = useRef(null)
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
    const [openContinentDetails, setOpenContinentDetails] = useState(false)
    const [selectedContinent, setSelectedContinent] = useState({})
    const [scale, setScale] = useState(1)

    const handleContinentClick = (continent, event) => {
        if (!transformRef.current) return
        const targetElement = event.currentTarget

        if (selectedContinent.name === continent.name) {
            transformRef.current.resetTransform(1000, "easeOut")
            setOpenContinentDetails(false)
            setSelectedContinent({})
            return
        } else {
            setOpenContinentDetails(true)
            setSelectedContinent(continent)
            transformRef.current.zoomToElement(targetElement, continent.scale, 1000, "easeOut")
        }
    }

    const getCardPosition = (name) => {
        const cardPositionMap = {
            "Oceania": "top-5 right-5",
            "Titanis": "top-5 right-5",
            "Zentara": "bottom-5 right-5",
            "Eldoria": "top-5 left-5",
            "Lunaria": "bottom-5 right-5",
            "Vastara": "bottom-5 left-5",
            "Mythos": "top-5 left-5",
        }

        return cardPositionMap[name]
    }

    useEffect(() => {
        if (!containerRef?.current) return
        updateDimensions(containerRef, setDimensions) // Set initial size
        window.addEventListener("resize", updateDimensions(containerRef, setDimensions))
        return () => window.removeEventListener("resize", updateDimensions(containerRef, setDimensions))
    }, [containerRef.current])

    return (
        <div className='w-[100%] h-[88vh] relative flex justify-center'>
            <TransformWrapper ref={transformRef} minScale={0.1} maxScale={30} initialScale={1} centerOnInit limitToBounds={true}
            onZoomStop={(ref) => selectedContinent?.id ? handleZoomStop(setScale, navigate, `/map/continent/${selectedContinent.id}`, ref, "worldZoomIn", selectedContinent.scale) : null}>
                <TransformComponent wrapperStyle={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(to bottom, #0077BE, #0A2E36)"
                }}
                contentStyle={{ width: "100%", height: "100%" }}>
                    <svg width="100%" height="100%" 
                        className="relative w-[100%] h-[100%] "
                        viewBox={`-3500 -3500 ${dimensions.width + 8000} ${dimensions.height + 8000}`}
                        style={{ background: "linear-gradient(to bottom, #0077BE, #0A2E36)" }}
                        // style={{ background: "linear-gradient(to bottom, #0A2E36, #74C0FC, #0077BE,  #0077BE, #74C0FC, #0A2E36)" }}
                    >
                        <ContinentsGradients />

                        {/* Continents */}
                        {continents.map((continent) => (
                            <g key={continent.name} onClick={(e) => handleContinentClick(continent, e)} className='cursor-pointer'>
                                <path d={scaleAndMovePath(continent.path, 
                                    continent.name === "Titanis" ? 22 
                                    : continent.name === "Lunaria" ? 17 
                                    : continent.name === "Vastara" ? 9
                                    : continent.name === "Zentara" ? 19.5
                                    : continent.name === "Oceania" ? 4.5
                                    : continent.name === "Mythos" ? 2.5
                                    : 20, continent.dx, continent.dy)}  fill={`url(#${continent.gradientId})`} stroke={continent.sand} strokeWidth="5" />
                            </g>
                        ))}

                        {/* Birds */}
                        <Birds />
                    </svg>
                </TransformComponent>
            </TransformWrapper>
            {openContinentDetails && (
                <div className={`white-opacity flex flex-col gap-4 room-event-animation w-[200px] lg:min-h-[300px] lg:h-fit lg:w-[300px] absolute
                ${getCardPosition(selectedContinent.name)} lg:top-10 lg:left-10 rounded-3xl p-5 text-white`}>
                    <div className='text-md lg:text-xl font-normal h-[15%] text-end'>{selectedContinent.name}</div>
                    <div className='h-85% flex flex-col gap-6'>

                        <div className='flex flex-col gap-3 text-[10px] lg:text-xs items-start'>
                            <div className='flex w-full items-center gap-4 justify-between'>
                                <div>Countries:</div>
                                <div className=''>{selectedContinent.countries.length}</div>
                            </div>
                            <div className='flex w-full items-center gap-4 justify-between'>
                                <div>Population:</div>
                                <div>95</div>
                            </div>
                            <div className='hidden lg:flex w-full items-center gap-4 justify-between'>
                                <div>Fatality Rate:</div>
                                <div>43%</div>
                            </div>
                            <div className='hidden lg:flex w-full items-center gap-4 justify-between'>
                                <div>Minerals:</div>
                                <div>Gold, Silver</div>
                            </div>
                            <div className='flex w-full items-center gap-4 justify-between'>
                                <div>Major Race:</div>
                                <div>Zentarian</div>
                            </div>
                            <div className='hidden lg:flex w-full items-center gap-4 justify-between'>
                                <div>Rank:</div>
                                <div>1</div>
                            </div>
                            <div className='flex w-full items-center gap-4 justify-between'>
                                <div>Average Temp:</div>
                                <div>35°C</div>
                            </div>
                        </div>

                        {/* Next Button */}
                        <div className='flex w-full items-center justify-end'>
                            <div onClick={() => navigate(`/map/continent/${selectedContinent.id}`)}
                            className='py-3 lg:py-4 border-2 border-white rounded-lg w-[50%] lg:w-[35%] text-center cursor-pointer text-[10px] lg:text-xs font-bold tracking-wide hover:bg-white hover:text-black transition-all ease-out duration-500'>Explore</div>
                        </div>
                        
                    </div>
                </div>
            )}
        </div>
    )
}

export default SocietyMap
