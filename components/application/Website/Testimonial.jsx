'use client'
import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { FaStar } from "react-icons/fa";
import { BsChatQuote } from "react-icons/bs";

const testimonials = [
  {
    name: "Amit Sharma",
    review: "E-Store has completely changed my online shopping experience. The product quality is always top-notch and the delivery is surprisingly fast. I’ve recommended it to all my friends and family — absolutely love it!",
    rating: 5
  },
  {
    name: "Neha Verma",
    review: "I was impressed with how user-friendly the website is. Finding what I wanted was super easy and the checkout process was smooth. Customer support was also very responsive when I had a query.",
    rating: 4
  },
  {
    name: "Rohan Gupta",
    review: "The variety of products available on E-Store is amazing. I’ve bought everything from clothes to gadgets here. Prices are fair and the discounts during sales are unbeatable. Highly recommend this platform!",
    rating: 5
  },
  {
    name: "Priya Singh",
    review: "I had an issue with one of my orders, but the support team resolved it quickly. It’s nice to see a company that actually cares about its customers. I’ll definitely continue shopping here regularly.",
    rating: 4
  },
  {
    name: "Arjun Mehta",
    review: "Everything arrived on time and the packaging was neat. The product looked exactly like the pictures, which is rare these days. The entire process felt very professional and trustworthy.",
    rating: 5
  },
  {
    name: "Sneha Patel",
    review: "I love how detailed the product descriptions are. It makes choosing the right item much easier. I also appreciate that they offer multiple payment options, which adds convenience to every order.",
    rating: 4
  },
  {
    name: "Karan Malhotra",
    review: "E-Store never disappoints! The quality, service, and prices all meet my expectations. Their return process is also hassle-free, which gives me confidence to try new products. Keep up the great work!",
    rating: 5
  },
  {
    name: "Isha Kapoor",
    review: "As someone who shops online frequently, I can say E-Store is one of the most reliable platforms. The user interface is clean and modern. I’ve never faced any payment issues or delivery delays.",
    rating: 5
  },
  {
    name: "Ravi Kumar",
    review: "The deals I find here are incredible. I recently bought a smartwatch at half the price compared to other sites. The product came sealed and authentic. I’ll surely keep checking for more offers.",
    rating: 4
  },
  {
    name: "Divya Chauhan",
    review: "It’s refreshing to see a store that balances affordability with quality. The customer feedback section also helps a lot when deciding on purchases. Great job on maintaining transparency and trust.",
    rating: 5
  }
];


const Testimonial = () => {
    const settings ={
        dots:true,
        infinite:true,
        speed:500,
        autoplay:true,
        slidesToShow:3,
        slidesToScroll:1,
  

        responsive:[
            {
                breakpoint:1024,
                settings : {
                   slidesToShow:2,
        slidesToScroll:1,
        dots:true,
        infinite:true,
                }
            },
              {
                breakpoint:768,
                settings : {
                   slidesToShow:1,
        slidesToScroll:1,
        dots:false,
        
                }
            },
            
        ]
    }
return (
    <div className='lg:px-32 px-4 sm:pt-20 pt-5 pb-10'>
        <h2 className='text-center sm:text-4xl text-2xl mb-5 font-semibold'>Customer Reviews</h2>
 <Slider {...settings}>
{testimonials.map((item,index)=>
(
    <div key={index} className='p-5'>
        <div className='border rounded-lg p-5 h-85'>
            <BsChatQuote size={30} className='mb-3'/>
            <p className='mb-5'>{item.review}</p>
<h4 className='font-semibold'>{item.name}</h4>
<div className='flex mt-1'>
    {Array.from({length:item.rating}).map((_,i)=>(
<FaStar key={`star${i}`} className='text-yellow-400'
size={20} />
    )

    )}
</div>
            
             </div>


    </div>

))}
    </Slider>
    </div>
  )
}

export default Testimonial
