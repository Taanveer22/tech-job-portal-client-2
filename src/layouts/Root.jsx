import { Outlet } from 'react-router';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const Root = () => {
  return (
    <div>
      <section className="mb-8 lg:mb-16">
        <Navbar></Navbar>
      </section>

      <section>
        <Outlet></Outlet>
      </section>

      <section>
        <Footer></Footer>
      </section>
    </div>
  );
};

export default Root;
