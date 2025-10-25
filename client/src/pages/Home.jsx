import React from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import TraillerSection from '../components/TraillerSection'
import UpcomingSection from '../components/UpcomingSection'


import CinemaServices from '../components/CinemaServices'



const Home = () => {
    return (
        
        <div>
            <HeroSection />
             
            <FeaturedSection />
            
            <UpcomingSection />

            {/*<CinemaPromo />/>*/}
         
        

                <CinemaServices/>


                    <TraillerSection />

        </div>
    )
}

export default Home
