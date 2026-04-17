import { Dialog, Flex, Text } from '@radix-ui/themes'
import "../../Game.css";
import { LoadArea } from '../../GameHandler.js'
import { FaLock } from "react-icons/fa6";
import { FaUnlock } from "react-icons/fa6";
import { GiTwoCoins } from 'react-icons/gi';
import { useState } from 'react';
import { useContext } from 'react';
import { GameContext } from "./GameContext.jsx"
import { OnPlayerGiveCoins } from '../../GameEvents.js';

export default function GameAreaPanel({ areaData, purchasedAreas, user, refresh }) {

    const gameContext = useContext(GameContext)
    const [hover, setHover] = useState(false)
    const canBuy = user.coinCount >= areaData.price
    const purchased = purchasedAreas.includes(areaData.id)

    async function TryPurchase() 
    {
        if (purchased || !canBuy) return
        
        let res = await fetch(`https://squirkle-backend.vercel.app/api/purchase-area/${areaData.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.user.uid })
        })

        if (res.status == 200) 
        {
            OnPlayerGiveCoins(-areaData.price)
            refresh()
            LoadArea(areaData.id)
        }
    }

    function OnClick()
    {
        if (purchased) LoadArea(areaData.id)
        else TryPurchase()
    }

    return (
        <Dialog.Close onClick={OnClick}>
            <Flex direction="column" style={{ backgroundImage: `url(${areaData.imageUrl})`, position: "relative", }} className={purchased ? 'gameAreaPanel purchased' : "gameAreaPanel"}
                onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                <div style={{flexGrow: 1}}/>
                <Flex className='gameAreaPanelTitle'>
                    <Text style={{ color: "white", fontWeight: "bold", textShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)" }} size="7">{areaData.name}</Text>
                </Flex>

                {
                    purchased ? null :
                    <Flex direction="column" align="center" justify="center" style={{position: "absolute", width: "100%", height: "90%"}} className='gameAreaLock'>
                        {
                            canBuy && hover ? 
                            <FaUnlock color='white' size={32} style={{ filter: "drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.5))" }}/>
                            : <FaLock color='white' size={32} style={{ filter: "drop-shadow(2px 2px 10px rgba(0, 0, 0, 0.5))" }}/>
                        }
                        <Flex align="center" gap="1">
                            <GiTwoCoins size={24} color="#f2c94c" />
                            <Text style={{ color: "#f2c94c", fontWeight: "bold", textShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)" }} size="7">{areaData.price}</Text>
                        </Flex>
                    </Flex>
                }
            </Flex>
        </Dialog.Close>
    )
}
