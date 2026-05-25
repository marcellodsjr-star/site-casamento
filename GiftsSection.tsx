import { motion } from "framer-motion";

interface GiftCard {
  id: string;
  name: string;
  logo: string;
  url: string;
  buttonText: string;
}

const giftCards: GiftCard[] = [
  {
    id: "casasbahia",
    name: "Casas Bahia",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Casas_Bahia_icon.svg/960px-Casas_Bahia_icon.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail",
    url: "https://www.casasbahia.com.br/",
    buttonText: "Ir para a Lista Oficial",
  },
  {
    id: "havan",
    name: "Havan",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Havan_logo.svg",
    url: "https://www.havan.com.br/",
    buttonText: "Ir para a Lista Oficial",
  },
  {
    id: "magalu",
    name: "Magazine Luiza",
    logo: "/manus-storage/magalu-logo_f752f300.webp",
    url: "https://www.magazineluiza.com.br/",
    buttonText: "Ir para a Lista Oficial",
  },
];

export default function GiftsSection() {
  return (
    <section
      id="gifts"
      className="py-24 px-4 bg-white dark:bg-[#151515]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, translateY: 30 }}
          whileInView={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="serif-font text-4xl md:text-5xl text-gray-900 dark:text-white mb-4">
            Lista de Presentes
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Escolha o presente perfeito em nossas lojas parceiras
          </p>
        </motion.div>

        {/* Gift Cards Grid */}
        <div className="flex justify-center px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-sm md:max-w-4xl">
            {giftCards.map((card, idx) => (
              <motion.a
                key={card.id}
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="h-full rounded-2xl bg-white dark:bg-[#1a1a1a] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] transition-all duration-300 p-6 md:p-8 flex flex-col items-center justify-center cursor-pointer">
                  {/* Logo Container */}
                  <div className="mb-6 h-16 flex items-center justify-center">
                    <img
                      src={card.logo}
                      alt={card.name}
                      className={`object-contain max-w-[90%] ${
                        card.id === 'casasbahia' || card.id === 'havan'
                          ? 'max-h-[50px] md:max-h-[50px]'
                          : 'max-h-[32px] md:max-h-[50px]'
                      }`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>

                  {/* Store Name */}
                  <h3 className="serif-font text-lg md:text-xl text-gray-900 dark:text-white text-center mb-6 font-normal">
                    {card.name}
                  </h3>

                  {/* Button */}
                  <button className="px-6 py-2 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black rounded-lg font-medium text-sm transition-colors duration-300 group-hover:shadow-lg">
                    {card.buttonText}
                  </button>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
