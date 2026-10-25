import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../sections/Hero';
import FeaturedProducts from '../sections/FeaturedProducts';
import WhyChooseUs from '../sections/WhyChooseUs';
import Technology from '../sections/Technology';
import Statistics from '../sections/Statistics';
import Testimonials from '../sections/Testimonials';
import CTA from '../sections/CTA';

const Home = ({ onNavigate }) => {
  return (
    <>
      <Navbar onNavigate={onNavigate} />
      <Hero />
      <FeaturedProducts />
      <WhyChooseUs />
      <Technology />
      <Statistics />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
};

export default Home;

