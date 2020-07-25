const request = require('request');

const forecast = (lat, long, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=430001be137511fb1475b31b5c9165e1&query='+lat+','+long;

    request({
        url,
        json: true
    }, (error, {body} = {}) => {
        if(error) {
            callback('There was a low level error', undefined);
        } else if (body.current.length === 0) {
            callback('There was a high level error', undefined);
        } else {
            callback(undefined, {
                temperature: body.current.temperature,
                description: body.current.weather_descriptions[0],
                wind_dir: body.current.wind_dir
            })
        }
    })
}

module.exports = forecast;