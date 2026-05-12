import Banner from '../components/Banner';
import HotJobs from '../components/HotJobs';

const Home = () => {
  return (
    <section className="w-11/12 max-w-6xl mx-auto">
      <div className="mb-8 lg:mb-16">
        <Banner></Banner>
      </div>
      <div className="mb-8 lg:mb-16">
        <HotJobs></HotJobs>
      </div>
    </section>
  );
};

export default Home;
