import { easeOut, motion } from 'motion/react';
import team1 from '../assets/team1.webp';
import team2 from '../assets/team2.jpg';

const Banner = () => {
  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="flex-1">
            <motion.img
              animate={{ y: [50, 100, 50] }}
              transition={{ duration: 10, repeat: Infinity }}
              src={team1}
              className=" max-w-sm rounded-t-4xl rounded-br-4xl border-l-4 border-b-4 border-blue-400"
            />
            <motion.img
              animate={{ x: [100, 150, 100] }}
              transition={{ duration: 10, delay: 5, repeat: Infinity }}
              src={team2}
              className=" max-w-sm rounded-t-4xl rounded-br-4xl border-l-4 border-b-4 border-blue-400"
            />
          </div>
          <div className="flex-1">
            <motion.h1
              animate={{ x: 50, color: ['#E33A19', '#19E320', '#19A0E3'] }}
              transition={{
                duration: 2,
                delay: 1,
                ease: easeOut,
                repeat: Infinity,
              }}
              className="text-5xl font-bold"
            >
              Job News!
            </motion.h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
