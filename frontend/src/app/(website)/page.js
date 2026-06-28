import React from 'react'

import Hero from './components/home/HeroBanner'
import CategorySlider from './components/Category'
import NewArrivals from './components/home/NewArrivals'
import InspireSection from './components/home/InspireSection'
import TopMarquee from './components/layout/TopMarquee'
import CategorySection from './components/home/CategorySection'
import TopSellingProducts from './components/home/TopSellingProducts'
import BannerSection from './components/home/BannerSection2' 
import BestCategories from './components/home/BestCategories'
import TrendingProducts from './components/home/TrendingProducts'
import CouponBanner from './components/home/CouponBanner'
import Reviews from './components/reviews/Reviews'
import Reviews1 from './components/reviews/Reviews1'
import ReviewsSection from './components/reviews/ReviewsSection'
import FAQ from './components/support/FAQSection'
import Blogs from './components/home/Blogs'
import ReadMoreContent from './components/ReadMoreContent'
const page = () => {
  return (
    <div>
      
      <Hero />
      <CategorySlider />  
      <NewArrivals />
        <InspireSection />
        <TopMarquee />
        <CategorySection />
        <TopSellingProducts />
        <BannerSection />
        <BestCategories />
        <TrendingProducts />
        <CouponBanner />
        <Reviews />
        <Reviews1 />
    
        

    
    <ReviewsSection />
    <FAQ />
    <Blogs />
    <ReadMoreContent />
    



  
</div>
  )
}




export default page
