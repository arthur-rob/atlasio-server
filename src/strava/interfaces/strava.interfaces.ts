export interface StravaActivity {
    id: number
    name: string
    distance: number
    moving_time: number
    elapsed_time: number
    total_elevation_gain: number
    type: string
    start_date: string
    start_date_local: string
    map: {
        id: string
        summary_polyline: string
    }
    average_speed: number
    max_speed: number
}

export interface StravaTokenResponse {
    access_token: string
}
