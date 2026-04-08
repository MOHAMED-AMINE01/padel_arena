import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const activities = [
  {
    id: 'Padel',
    title: 'PADEL',
    image: '/IMAGES/vincenzo-morelli-ZO4pHKtpn4c-unsplash.jpg',
    description: "Découvrez le sport qui fait sensation ! Des courts modernes avec des parois en verre pour une expérience de jeu optimale.",
    buttonText: 'Réserver',
    titleColor: 'text-padel-blue',
    buttonColor: 'bg-padel-blue text-white hover:bg-padel-yellow/90 hover:text-black'
  },
  {
    id: 'Pickleball',
    title: 'PICKLEBALL / BADMINTON',
    image: '/IMAGES/oskar-hagberg-uJlPtLTZT7c-unsplash.jpg',
    description: "Découvrez notre terrain hybride Pickleball / Badminton, conçu pour offrir une polyvalence maximale et une expérience de jeu optimale.",
    buttonText: 'Réserver',
    titleColor: 'text-padel-blue',
    buttonColor: 'bg-padel-blue text-white hover:bg-padel-yellow/90 hover:text-black'
  },
  {
    id: 'Basket',
    title: 'BASKET 3X3',
    image: '/IMAGES/rajesh-rajput-uxT88tEadFg-unsplash.jpg',
    description: "Découvrez notre terrain de basket 3×3, un espace d'exception chargé d'histoire. Utilisé lors des Jeux Olympiques 2024, ce court officiel offre des conditions de jeu haut de gamme, fidèles aux standards internationaux.",
    buttonText: 'Réserver',
    titleColor: 'text-padel-blue',
    buttonColor: 'bg-padel-blue text-white hover:bg-padel-yellow/90 hover:text-black'
  },
  {
    id: 'Golf',
    title: 'SIMULATEUR DE GOLF',
    image: '/IMAGES/Simulateur golf.jpg',
    description: "Jouez sur les plus beaux parcours du monde grâce à notre simulateur de golf haute technologie.",
    buttonText: 'Réserver',
    titleColor: 'text-padel-blue',
    buttonColor: 'bg-padel-blue text-white hover:bg-padel-yellow/90 hover:text-black'
  }
];

interface ActivityCardProps {
  activity: {
    id: string;
    title: string;
    image: string;
    description: string;
    buttonText: string;
    titleColor: string;
    buttonColor: string;
  };
  index: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative group rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[16/12]"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={activity.image}
          alt={activity.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
        <h3 className={`text-2xl md:text-3xl font-display font-black ${activity.titleColor} mb-3 tracking-tight uppercase`}>
          {activity.title}
        </h3>
        <p className="text-white/80 text-sm md:text-base leading-relaxed mb-5 max-w-md">
          {activity.description}
        </p>
        <Link
          to={`/?sport=${activity.id}#club`}
          className={`inline-flex items-center justify-center font-bold text-sm px-6 py-3 rounded-lg transition-colors w-fit ${activity.buttonColor}`}
        >
          {activity.buttonText}
        </Link>
      </div>
    </motion.div>
  );
};

export const OurActivities = () => {
  return (
    <section className="py-20 md:py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight uppercase mb-4">
            <span className="text-white">NOS </span>
            <span className="text-padel-blue">ACTIVITÉS</span>
          </h2>
          <p className="text-white/60 text-base md:text-lg">
            Quatre sports, une seule destination. Choisissez votre passion.
          </p>
        </motion.div>

        {/* Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-24">
          {activities.map((activity, index) => (
            <ActivityCard key={activity.id} activity={activity} index={index} />
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tight uppercase mb-4">
            <span className="text-padel-blue">1600 M²</span> <span className="">D'ACTIVITÉS !</span>
          </h3>
          <p className="text-white/60 text-base md:text-lg">
            5 sports, une seule destination. Choisissez votre passion.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
