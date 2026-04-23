import { GiGooeySword } from "react-icons/gi";
import { GiOpenTreasureChest } from "react-icons/gi";
import { GiWorld } from "react-icons/gi";

const iconStyle = {
    width: "150px",
    height: "150px",
    margin: "0 auto"
}

export const cardData = [
    {
        title: 'Endless Satisfaction',
        description: 'Slice a never-ending wave of enemies in half.',
        image: <GiGooeySword color="white" style={iconStyle}/>
    },
    {
        title: 'Loot & Progression',
        description: 'Collect weapons and armor with special abilities to grow stronger.',
        image: <GiOpenTreasureChest color="white" style={iconStyle}/>
    },
    {
        title: 'Player Trading',
        description: 'Sell your rare items on the Auction House.',
        image: <GiWorld color="white" style={iconStyle}/>
    }
];