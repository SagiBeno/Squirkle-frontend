import { Dialog, Flex, Text } from '@radix-ui/themes'
import "../Game.css"
import { LoadArea } from '../GameHandler'

export default function GameAreaPanel({ areaData }) {

    return (
        <Dialog.Close onClick={() => LoadArea(areaData.id)}>
            <Flex align="end" style={{ backgroundImage: `url(${areaData.img})` }} className='gameAreaPanel'>
                <Text style={{ color: "white", fontWeight: "bold", textShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)" }} size="7">{areaData.name}</Text>
            </Flex>
        </Dialog.Close>
    )
}
