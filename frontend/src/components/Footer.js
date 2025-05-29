import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { CiFacebook, CiTwitter, CiInstagram } from "react-icons/ci";
import { FaGoogle, FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
const Footer = () => {
    return (
        <div className="footer">
            <footer className="mainFooter has-toolbar">
                <div className="footer-newsletter">
                    <div className="container-fluid">
                        <div className="wrapbox-newsletter d-flex justify-content-between align-items-center">
                            <div className="newsletter-block">
                                <h3 className="newsletter-title">Đăng ký nhận tin</h3>
                                <form acceptCharset="UTF-8" action="/account/contact" method="post" className="contact-form d-flex">
                                    <input type="hidden" name="form_type" value="customer" />
                                    <input type="hidden" name="utf8" value="✓" />
                                    <input required type="email" name="contact[email]" className="form-control newsletter-input" placeholder="Nhập email của bạn" />
                                    <button type="submit" className="button dark newsletter-btn">Đăng ký</button>
                                </form>
                            </div>
                            <div className="newsletter-block">
                                <h3 className="newsletter-title d-none d-md-block">Kết nối với chúng tôi</h3>
                                <ul className="footerNav-social d-flex">
                                    <li className='icons'><FaFacebookF /></li>
                                    <li className='icons'><FaTwitter /></li>
                                    <li className='icons'><FaInstagram /></li>
                                    <li className='icons'><FaGoogle /></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-container">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-4 widget-footer">
                                <h4 className="title-footer">Về Bistro West</h4>
                                <p>Bistro West đã có hơn 16 năm sáng tạo và phát triển, mang đến những món ăn đỉnh cao kết hợp tinh hoa ẩm thực phương Tây và hồn Việt.</p>
                                <ul className="contact-info">
                                    <li><i className="fa fa-map-marker"></i> 182 Lê Đại Hành, Quận 11, TP. HCM</li>
                                    <li><i className="fa fa-phone"></i> 1900.000.XXX</li>
                                    <li><i className="fa fa-envelope"></i> hi@bistro-west.abc</li>
                                </ul>
                            </div>
                            <div className="col-lg-3 widget-footer">
                                <h4 className="title-footer">Hỗ trợ khách hàng</h4>
                                <ul className="footerNav-link">
                                    <li><Link to="/collections/onsale">Sản phẩm khuyến mãi</Link></li>
                                    <li><Link to="/collections/hot-products">Sản phẩm nổi bật</Link></li>
                                    <li><Link to="/collections/all">Tất cả sản phẩm</Link></li>
                                </ul>
                            </div>
                            <div className="col-lg-2 widget-footer">
                                <h4 className="title-footer">Liên kết</h4>
                                <ul className="footerNav-link">
                                    <li><Link to="/">Trang chủ</Link></li>
                                    <li><Link to="/pages/about-us">Giới thiệu</Link></li>
                                    <li><Link to="/pages/thuc-don">Thực đơn</Link></li>
                                    <li><Link to="/pages/dat-ban">Đặt bàn</Link></li>
                                </ul>
                            </div>
                            <div className="col-lg-3 widget-footer">
                                <h4 className="title-footer">Chính sách</h4>
                                <ul className="footerNav-link">
                                    <li><Link to="/search">Tìm kiếm</Link></li>
                                    <li><Link to="/pages/chinh-sach-doi-tra">Chính sách đổi trả</Link></li>
                                    <li><Link to="/pages/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="footer-copyright text-center">
                            <p>Copyright © 2025 <a href="https://bistro-west.myharavan.com">Bistro West</a>. Powered by <a href="https://www.haravan.com">Haravan</a></p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
