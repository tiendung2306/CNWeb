import React from 'react';
import './Recommend.css'; // Import file CSS

import seafood from '../../assets/images/seafood.jpg'
import hamburger from '../../assets/images/hamburger.jpg'
import coffee from '../../assets/images/coffee.jpg'
import westernFood from '../../assets/images/westernFood.jpg'
import seafoodIcon from '../../assets/icons/seafood-icon.svg'
import hamburgerIcon from '../../assets/icons/hamburger-icon.svg'
import coffeeIcon from '../../assets/icons/coffee-icon.svg'
import foodIcon from '../../assets/icons/food-icon.svg'
const Recommend = () => {
    return (
        <div className="category-container">
            <div className="category-title">
                <h1>MÓN NGON NÊN THỬ</h1>
                <p>Best food for you and family</p>
            </div>
            <div className="category-items">
                <div className="category-item">
                    <div className="category-image">
                        <img src={seafood} alt="Hải sản" />
                    </div>
                    <div className="category-icon">
                        {/* Thay thế với biểu tượng hải sản của bạn */}
                        <img src={seafoodIcon} alt="Seafood Icon" />
                    </div>
                    <h3>Hải sản</h3>
                    <p>Quis suspe ultrices gravid Risus commo viverra maece</p>
                    <button><span>XEM THÊM</span></button>
                </div>
                <div className="category-item">
                    <div className="category-image">
                        <img src={hamburger} alt="Burger phô mai" />
                    </div>
                    <div className="category-icon">
                        {/* Thay thế với biểu tượng burger của bạn */}
                        <img src={hamburgerIcon} alt="Burger Icon" />
                    </div>
                    <h3>Burger phô mai</h3>
                    <p>Quis suspe ultrices gravid Risus commo viverra maece</p>
                    <button><span>XEM THÊM</span></button>
                </div>
                <div className="category-item">
                    <div className="category-image">
                        <img src={coffee} alt="Kem - Coffee" />
                    </div>
                    <div className="category-icon">
                        {/* Thay thế với biểu tượng kem-coffee của bạn */}
                        <img src={coffeeIcon} alt="Coffee Icon" />
                    </div>
                    <h3>Kem - Coffee</h3>
                    <p>Quis suspe ultrices gravid Risus commo viverra maece</p>
                    <button><span>XEM THÊM</span></button>
                </div>
                <div className="category-item">
                    <div className="category-image">
                        <img src={westernFood} alt="Món Tây" />
                    </div>
                    <div className="category-icon">
                        {/* Thay thế với biểu tượng món Tây của bạn */}
                        <img src={foodIcon} alt="Western Icon" />
                    </div>
                    <h3>Món Tây</h3>
                    <p>Quis suspe ultrices gravid Risus commo viverra maece</p>
                    <button><span>XEM THÊM</span></button>
                </div>
            </div>
        </div>
    );
};

export default Recommend;