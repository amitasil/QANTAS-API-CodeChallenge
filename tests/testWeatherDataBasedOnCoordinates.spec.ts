import { test, expect } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()

const latitude = 51.5072
const longitude = -0.12768

//Happy path Scenario
test('should get current weather data based on longitude and latitude @lon&latTest', async ({ request }) => {
    const response = await request.get(`forecast/hourly?lat=${latitude}&lon=${longitude}&key=${process.env.API_KEY}`)

    expect(response.status()).toBe(200)

    const jsonResponse = await response.json()

    expect(jsonResponse.city_name).toEqual('London')

    expect(jsonResponse).toMatchObject({
        city_name: 'London',
        lon: -0.13,
        timezone: 'Europe/London',
        lat: 51.51,
        country_code: 'GB',
        state_code: 'ENG'
    })
})

//Test with no API Key
test('should get response code for not providing api key in URL @lon&latTest_UnAuthorized', async ({ request }) => {
    const response = await request.get(`forecast/hourly?lat=${latitude}&lon=${longitude}`)

    expect(response.status()).toBe(403)
})

//Test with invalid latitude value
test('should get response code 400 and error message for invalid lat/lon value @lon&latTest_InvalidLat', async ({ request }) => {
    const response = await request.get(`forecast/hourly?lat=invalidLat&lon=${longitude}&key=${process.env.API_KEY}`)

    expect(response.status()).toBe(400)

    const jsonResponse = await response.json()

    expect(jsonResponse).toMatchObject({
        error: 'Invalid lat/lon supplied.'
    })
})
