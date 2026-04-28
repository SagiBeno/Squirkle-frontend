let setCoins = null
let baseCoins = 0
let addedCoins = 0
let hasBaseCoins = false

export function SetGameContext(_gameContext) {
    setCoins = _gameContext?.setCoins ?? null

    if (hasBaseCoins) setCoins(baseCoins + addedCoins)
}

export function OnPlayerGiveCoins(coins) {
    if (setCoins == null) return

    addedCoins += Number(coins)
    setCoins(baseCoins + addedCoins)
}

export function ResetPlayerCoins(coins = baseCoins) {
    baseCoins = Number(coins)
    hasBaseCoins = true
    addedCoins = 0

    if (setCoins == null) return

    setCoins(baseCoins)
}

export function onPlayerGetItem(itemId) {

}