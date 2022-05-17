const axios = require('axios')
const { get } = require('http')
const API_KEY = 'AIzaSyBCu-HaBefZeYvKpD_Yrg_JgLWR64FkGFU'
const HttpError = require('../models/http-error')

const getCoorsForAddress = async (address) => {
    
    const response = await

    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}
    `)

    const data = response.data

    if(!data || data.status === 'ZERO_RESULTS') {
        const error = new HttpError('Could not find the location', 422)
        throw error; 
    }
    
    const coordinates = data.results[0].geometry.location

    return coordinates

}

module.exports = getCoorsForAddress