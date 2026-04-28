let setCoins = null
let baseCoins = 0
let addedCoins = 0
let hasBaseCoins = false
let showNewItemToast = null

export function SetGameContext(_gameContext) {
    setCoins = _gameContext?.setCoins ?? null
    showNewItemToast = _gameContext?.showNewItemToast ?? null

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

export function OnPlayerGetItem(itemId) {
    async function handlePlayerGetItem(itemId) {
        if (!itemId || showNewItemToast == null) return

        try {
            const response = await fetch(`https://squirkle-backend.vercel.app/api/get-item/${itemId}`)
            const result = await response.json()
            const itemData = result?.item ?? result

            showNewItemToast(itemData?.name)
        } catch (error) {
            console.warn(error)
        }
    }
    handlePlayerGetItem(itemId)
}