import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const activities = [
  {
    id: 'Padel',
    title: 'PADEL',
    image: '/IMAGES/vincenzo-morelli-ZO4pHKtpn4c-unsplash.jpg',
    description: "La référence du club avec 3 terrains panoramiques dernière génération pour une expérience de jeu optimale.",
    buttonText: 'Réserver',
    titleColor: 'text-padel-blue',
    buttonColor: 'bg-padel-blue text-white hover:bg-padel-yellow/90 hover:text-black'
  },
  {
    id: 'Pickleball',
    title: 'PICKLEBALL',
    image: '/IMAGES/oskar-hagberg-uJlPtLTZT7c-unsplash.jpg',
    description: "Découvrez le Pickleball sur notre terrain dédié, le sport de raquette ultra-tendance alliant fun et accessibilité.",
    buttonText: 'Réserver',
    titleColor: 'text-padel-blue',
    buttonColor: 'bg-padel-blue text-white hover:bg-padel-yellow/90 hover:text-black'
  },
  {
    id: 'Badminton',
    title: 'BADMINTON',
    image: '/IMAGES/oskar-hagberg-uJlPtLTZT7c-unsplash.jpg',
    description: "Profitez de notre terrain de badminton de haute qualité pour des échanges dynamiques et sportifs.",
    buttonText: 'Réserver',
    titleColor: 'text-padel-blue',
    buttonColor: 'bg-padel-blue text-white hover:bg-padel-yellow/90 hover:text-black'
  },
  {
    id: 'Golf',
    title: 'GOLF INDOOR',
    image: '/IMAGES/Simulateur golf.jpg',
    description: "Perfectionnez votre swing sur les plus beaux parcours du monde grâce à notre simulateur de golf haute technologie.",
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
    <div
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
    </div>
  );
};

export const OurActivities = () => {
  return (
    <section className="py-20 md:py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight uppercase mb-4">
            <span className="text-white">NOS </span>
            <span className="text-padel-blue">ACTIVITÉS</span>
          </h2>
          <p className="text-white/60 text-base md:text-lg">
            Quatre sports, une seule destination. Choisissez votre passion.
          </p>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-24">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.01 }}
              transition={{ duration: 0.3 }}
            >
              <ActivityCard activity={activity} index={index} />
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="text-center">
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tight uppercase mb-4">
            <span className="text-padel-blue">1600 M²</span> <span className="">D'ACTIVITÉS !</span>
          </h3>
          <p className="text-white/60 text-base md:text-lg">
            4 sports, une seule destination. Choisissez votre passion.
          </p>
        </div>
      </div>
    </section>
  );
};
