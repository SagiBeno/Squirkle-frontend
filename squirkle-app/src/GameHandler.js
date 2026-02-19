const JSBridge = "JSBridge"
let sendMessage = null

export function InitializeGameHandler(_sendMessage)
{
    sendMessage = _sendMessage
}

/////////////////////////////////////////////////////////////////

export function EquipWeapon(weapon)
{
    sendMessage(JSBridge, "SetPlayerWeapon", JSON.stringify(weapon))
}