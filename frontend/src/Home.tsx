import "./App.css";
import paper from "./assets/paper.png";
import textLogo from "./assets/textlogo.png";
import { motion } from "motion/react";

function Hero() {
  return (
    <div className="h-screen flex flex-col justify-center gap-6 items-center">
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-60 h-60 flex justify-center items-center scale-150">
          <motion.img
            // initial rotate to 15 deg
            initial={{ rotate: 30 }}
            animate={{ y: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            src={paper}
            alt=""
            className="cursor-pointer w-40 absolute"
          />
          <motion.img
            animate={{ y: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            initial={{ rotate: 15 }}
            src={paper}
            alt=""
            className="cursor-pointer w-40 absolute"
          />
          <motion.img
            animate={{ y: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            initial={{ rotate: 5, x: -20 }}
            src={paper}
            alt=""
            className="cursor-pointer w-40 absolute"
          />
          <motion.img
            animate={{ y: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 2.3 }}
            src={textLogo}
            alt=""
            className="cursor-pointer w-60 absolute"
          />
        </div>
      </div>
      <div>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-5xl font-bold">Welcome to examtrade</h1>
          <p className="text-lg mt-4">
            A Tunisian platform for students to exchange exams and study
            materials.
            <br />
            ExamTrade also provides a platform for professors to share their own
            research papers and exams.
            <br />
            Future features will be added soon.
          </p>
        </div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div>
      <Hero />
    </div>
  );
}
import ReactSparkle from "react-sparkle";

function Sparkles() {
  return (
    <div className="absolute inset-0">
      <ReactSparkle
        count={50}
        minSize={4}
        maxSize={7}
        fadeOutSpeed={10}
        flicker={false}
        flickerSpeed="fast"
      />
    </div>
  );
}

export default Home;
