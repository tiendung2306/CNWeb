import React from 'react';
import './ContactPage.css'; // import CSS

const ContactPage = () => {
    const listMember = [
        {
            hoten: "Lê Tiến Dũng",
            mssv: "0000000",
            email: "dung@gmail.com",
            github: "dung.github.com",
        },
        {
            hoten: "Đinh Mạnh Dũng",
            mssv: "0000000",
            email: "dung@gmail.com",
            github: "dung.github.com",
        },
        {
            hoten: "Hoàng Dũng",
            mssv: "0000000",
            email: "dung@gmail.com",
            github: "dung.github.com",
        },
        {
            hoten: "Nguyễn Dũng",
            mssv: "0000000",
            email: "dung@gmail.com",
            github: "dung.github.com",
        }
    ];

    return (
        <div className="contact-page">
            <h2 className="contact-title">Thành viên nhóm</h2>
            <div className="contact-grid">
                {listMember.map((member, index) => (
                    <div key={index} className="contact-card">
                        <p><strong>Họ và tên:</strong> {member.hoten}</p>
                        <p><strong>MSSV:</strong> {member.mssv}</p>
                        <p><strong>Email:</strong> {member.email}</p>
                        <p><strong>Github:</strong> <a href={`https://${member.github}`} target="_blank" rel="noopener noreferrer">{member.github}</a></p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContactPage;
