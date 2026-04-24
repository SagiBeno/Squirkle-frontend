import { GiGooeySword } from "react-icons/gi";
import { GiOpenTreasureChest } from "react-icons/gi";
import { GiWorld } from "react-icons/gi";

/**
 * @typedef { Object } HomePageCardData
 * @property { string } title - Title of the card
 * @property { string } description - Description text displayes on the card
 * @property { JSX.Element } image - React element representing the card icon
 */

const iconStyle = {
    width: "150px",
    height: "150px",
    margin: "0 auto"
}

/**
 * List of data used to render homepage cards.
 * 
 * Each item represent a feature of the game,
 * including title, description, and an icon.
 * 
 * @type { HomePageCardData[] }
 */

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