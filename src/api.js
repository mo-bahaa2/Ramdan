const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.aladhan.com/v1'
// Fallback to the original embedded key from the old script.js if env is not provided
const YT_KEY = import.meta.env.VITE_YT_KEY || 'AIzaSyCUwpF2ExQuqIfI36RLX_6-tXTVAiTClUA'

export async function fetchTimingsByCity(city = 'Cairo', country = 'Egypt', method = 8) {
    const url = `${API_BASE}/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`
    const res = await fetch(url)
    return res.json()
}

export async function fetchPlaylistItems(playlistId, all = true) {
    if (!YT_KEY) throw new Error('VITE_YT_KEY not set')
    let items = []
    let nextPageToken = ''

    do {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${YT_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`
        const res = await fetch(url)
        const data = await res.json()

        if (data.items) {
            items = [...items, ...data.items]
        }

        nextPageToken = (all && data.nextPageToken) ? data.nextPageToken : null
    } while (nextPageToken)

    return { items }
}
