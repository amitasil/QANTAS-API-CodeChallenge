import { test, expect } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()

const postalCode = 2150

//Happy path Scenario
test('should get current weather data based on postal code @postalCodeTest', async ({ request }) => {
    const response = await request.get(`current?postal_code=${postalCode}&key=${process.env.API_KEY}`)

    await expect(response.status()).toBe(200)

    const jsonResponse = await response.json()

    await expect(jsonResponse.data[0].city_name).toEqual('Harris Park')

    console.log(`Temperature at location with postal code ${postalCode} is: ` + jsonResponse.data[0].temp)
})

//Test with no API Key
test('should get response code for not providing api key in URL @postalCodeTest_UnAuthorized', async ({ request }) => {
    const response = await request.get(`current?postal_code=${postalCode}`)

    await expect(response).not.toBeOK()

    await expect(response.status()).toBe(403)
})

//Test with junk postal code value
test('should get response code 204 (No Content) for junk postal code value @postalCodeTest_JunkPostalCode', async ({ request }) => {
    const response = await request.get(`current?postal_code=junkPostalCode&key=${process.env.API_KEY}`)

    await expect(response.status()).toBe(204)
})
