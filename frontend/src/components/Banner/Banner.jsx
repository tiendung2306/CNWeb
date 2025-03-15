import React from 'react'
import banner1 from '../../assets/images/banner-1.jpg'
import banner2 from '../../assets/images/banner-2.jpg'
import banner3 from '../../assets/images/banner-3.jpg'
import banner4 from '../../assets/images/banner-4.jpg'
import banner5 from '../../assets/images/banner-5.jpg'
import food1 from '../../assets/images/food-1.jpg'

import './Banner.css'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';



// import required modules
import { Pagination } from 'swiper/modules';
const Banner = () => {
    return (

        <div className="stacked-layout">
            <div className="top-section">
                {/* Nội dung phần trên cùng */}
                <Swiper

                    className="mySwiper"
                >
                    <SwiperSlide className='swiperSlide'>
                        <img src={banner1} alt="" />
                        <div className='text-overlay'>
                            <h2>Khuyến mãi khai trương</h2>
                            <h1>Tất cả sản phẩm tại<br /> quán & Online </h1>
                            <p>Liên hệ đặt bàn để chúng tôi phục vụ bạn tốt nhất</p>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide className='swiperSlide'>
                        <img src={banner2} alt="" />
                        <div className='text-overlay'>
                            <h2>Khuyến mãi khai trương</h2>
                            <h1>Tất cả sản phẩm tại<br /> quán & Online </h1>
                            <p>Liên hệ đặt bàn để chúng tôi phục vụ bạn tốt nhất</p>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className='swiperSlide'>
                        <img src={banner3} alt="" />
                        <div className='text-overlay'>
                            <h2>Khuyến mãi khai trương</h2>
                            <h1>Tất cả sản phẩm tại<br /> quán & Online </h1>
                            <p>Liên hệ đặt bàn để chúng tôi phục vụ bạn tốt nhất</p>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className='swiperSlide'>
                        <img src={banner4} alt="" />
                        <div className='text-overlay'>
                            <h2>Khuyến mãi khai trương</h2>
                            <h1>Tất cả sản phẩm tại<br /> quán & Online </h1>
                            <p>Liên hệ đặt bàn để chúng tôi phục vụ bạn tốt nhất</p>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className='swiperSlide'>
                        <img src={banner5} alt="" />
                        <div className='text-overlay'>
                            <h2>Khuyến mãi khai trương</h2>
                            <h1>Tất cả sản phẩm tại<br /> quán & Online </h1>
                            <p>Liên hệ đặt bàn để chúng tôi phục vụ bạn tốt nhất</p>
                        </div>
                    </SwiperSlide>
                </Swiper>

            </div>
            <div className="bottom-section">
                <div className='food-card'>
                    <img src={food1} alt="" />
                    <div className='text-foodcard'>
                        <h2>Nước trái cây</h2>
                        <p>Được làm từ trái cây tươi với nhiều vitamin</p>
                        <button>Xem thêm</button>
                    </div>
                </div>
                <div className='food-card'>
                    <img src={food1} alt="" />
                    <div className='text-foodcard'>
                        <h2>Nước trái cây</h2>
                        <p>Được làm từ trái cây tươi với nhiều vitamin</p>
                        <button>Xem thêm</button>
                    </div>
                </div>
                <div className='food-card'>
                    <img src={food1} alt="" />
                    <div className='text-foodcard'>
                        <h2>Nước trái cây</h2>
                        <p>Được làm từ trái cây tươi với nhiều vitamin</p>
                        <button>Xem thêm</button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Banner
