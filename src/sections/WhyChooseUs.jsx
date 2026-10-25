import "./WhyChooseUs.css";
import {
    Snowflake,
    Zap,
    Volume2,
    ShieldCheck
} from "lucide-react";

const features = [
    {
        icon: <Snowflake size={38} />,
        title: "No Frost",
        desc: "Keep food fresh without ice build-up."
    },
    {
        icon: <Zap size={38} />,
        title: "Energy Saving",
        desc: "High efficiency with lower electricity consumption."
    },
    {
        icon: <Volume2 size={38} />,
        title: "Low Noise",
        desc: "Enjoy a peaceful and quiet kitchen."
    },
    {
        icon: <ShieldCheck size={38} />,
        title: "2 Years Warranty",
        desc: "Reliable quality with official warranty."
    }
];

export default function WhyChooseUs() {

    return (

        <section id="about" className="why">

            <div className="container">

                <p className="section-tag">
                    WHY CHOOSE HAILANG
                </p>

                <h2>
                    Innovation That Brings
                    Freshness To Every Home
                </h2>

                <p className="section-desc">
                    Designed with premium technology,
                    elegant appearance and dependable
                    performance for modern families.
                </p>

                <div className="feature-grid">

                    {features.map((item, index) => (

                        <div
                            className="feature-card"
                            key={index}
                        >

                            <div className="icon">
                                {item.icon}
                            </div>

                            <h3>{item.title}</h3>

                            <p>{item.desc}</p>

                        </div>

                    ))}

                </div>

            </div>

        </section>

    );

}