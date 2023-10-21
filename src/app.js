const path = require('path')
const express = require('express')
const hbs = require('hbs')
const app = express()
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Fernando Ramirez'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Fernando Ramirez'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpText: 'Example message',
        name: 'Fernando Ramirez'
    })
})


app.get('/weather', (req, res) => {
    const address = req.query.address

    if (!address){
        return res.send({
            error: 'You must provide an address'
        })
    }
    
    geocode(address, (error,{latitude, longitude, location}={})=>{
        if (error) {
            return res.send(error)
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send(error)
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*', (req,res)=>{
    res.render('404', {
        title: '404',
        errorMessage: 'Help article not found',
        name: 'Fernando Ramirez'
    })
})

app.get('/products', (req,res)=>{
    if (!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    
    }
    console.log(req.query.search)
    res.send({
        products: []
    
    })
})

app.get('*', (req,res)=>{
    res.render('404', {
        title: '404',
        errorMessage: 'Page not found',
        name: 'Fernando Ramirez'
    })
})

app.listen(3000, ()=>{
    console.log('Server is up on port 3000.')
})

