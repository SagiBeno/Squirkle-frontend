import { Flex, Text } from '@radix-ui/themes'
import { GiTwoCoins } from 'react-icons/gi'
import { useContext } from 'react'
import { GameContext } from './GameContext'

export default function CoinCounter({ isMobile = false }) {

    const gameContext = useContext(GameContext)

    return (
        <Flex align="center" gap="2" style={{ marginRight: isMobile ? 10 : 0 }}>
            <GiTwoCoins size={24} color="#f2c94c" />
            <Text size="3" style={{ color: '#f2c94c', fontWeight: 700 }}>
                {gameContext.coins}
            </Text>
        </Flex>
    )
}
