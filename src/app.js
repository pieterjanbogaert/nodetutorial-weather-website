const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000

const public_dir = path.join(__dirname, '../public');
const views_path = path.join(__dirname, '../templates/views');
const partials_path = path.join(__dirname, '../templates/partials');

app.set('view engine', 'hbs');
app.set('views', views_path);
hbs.registerPartials(partials_path);

app.use(express.static(public_dir));

app.get('', (req, res) => {
    res.render('index', {
        title: 'This is a different title, again',
        name: 'Pieter-Jan'
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Pieter-Jan'
    });
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        msg: 'This is the help message',
        name: 'Pieter-Jan'
    });
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'No address provided'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({
                error: error
            })
        }
    
        forecast(latitude, longitude, (error, {temperature, description, wind_dir} = {}) => {
            if (error) {
                return res.send({
                    error: error
                })
            }
            
            res.send({
                temperature,
                description,
                wind_dir,
                location
            })
            //console.log('Temperature for ' + location + ' is ' + temperature + ' and the weather is ' + description + '. The wind direction is ' + wind_dir + '.');
        })
    })
})

app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Pieter-Jan',
        error_msg: 'This help article was not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Pieter-Jan',
        error_msg: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Listening on port '+port);
})