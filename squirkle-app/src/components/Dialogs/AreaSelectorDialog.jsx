import { Dialog, Flex } from '@radix-ui/themes'
import { areas } from '../../AreaData'
import GameAreaPanel from '../GameAreaPanel'

export default function AreaSelectorDialog() {
    return (
        <Dialog.Content maxWidth="450px" style={{ padding: 0, borderRadius: 0, boxShadow: "none", backgroundColor: "transparent", overflow: "auto" }}>
            <Dialog.Title style={{ textAlign: "center", marginTop: 15, color: "white" }}>SELECT A NEW AREA</Dialog.Title>

            <Flex direction="column" style={{ maxHeight: 300, overflowY: "scroll", scrollSnapType: "y mandatory" }}>
            {
                areas.map(x => <GameAreaPanel key={x.id} areaData={x} />)
            }
            </Flex>
        </Dialog.Content>
    )
}
