import React from 'react'
import Banner from '../../components/Banner/Banner'
import SecondBanner from '../../components/SecondBanner/SecondBanner'
import Recommend from '../../components/Recommend/Recommend'
import Menu from '../../components/Menu/Menu'
import Features from '../../components/Feature/Feature'
import NewsEvents from '../../components/NewsEvents/NewsEvents'
import Reviews from '../../components/Reviews/Reviews'
import Booking from '../../components/Booking/Booking'
import Footer from '../../components/Footer/Footer'

const Home = () => {
    return (
        <div>
            <Banner />
            <SecondBanner />
            <Recommend />
            {/* <Menu /> */}
            <Features />
            <NewsEvents />
            <Reviews />
            <Booking />
            <Footer />
        </div>
    )
}

export default Home
