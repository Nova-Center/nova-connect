"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Users,
  MessageCircle,
  Calendar,
  Shield,
  Info,
  Heart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Loader from "@/components/landing/loader";
import TestimonialCard from "@/components/landing/testimonial-card";
import StepCard from "@/components/landing/step-card";
import BenefitCard from "@/components/landing/benefit-card";

export default function LandingPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#FEF1ED]">
      <div className="container mx-auto px-4 py-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-16 pt-6"
        >
          <Image
            src="/images/nova-connect-logo.png"
            alt="Nova Connect Logo"
            width={180}
            height={72}
            className="h-auto"
          />
          <div className="flex gap-4">
            <Link href="/auth/login">
              <button className="px-6 py-2 cursor-pointer rounded-full bg-white text-gray-800 font-medium shadow-md hover:shadow-lg transition-all duration-300">
                Se connecter
              </button>
            </Link>
            <Link href="/auth/register">
              <button className="px-6 py-2 cursor-pointer rounded-full bg-[#7ED957] text-white font-medium shadow-md hover:shadow-lg transition-all duration-300">
                S'inscrire
              </button>
            </Link>
          </div>
        </motion.header>

        <main>
          {/* Hero Section */}
          <section className="max-w-4xl mx-auto text-center mb-24">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6 text-gray-800"
            >
              Connectez-vous avec votre quartier
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 mb-12"
            >
              Rejoignez votre communauté locale, partagez des mises à jour et
              rencontrez vos voisins dans une seule application simple.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/auth/register">
                <button className="px-8 py-4 cursor-pointer rounded-full bg-[#7ED957] text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] flex items-center justify-center gap-2 min-w-[180px]">
                  Commencer <ArrowRight size={18} />
                </button>
              </Link>
            </motion.div>
          </section>

          {/* How It Works Section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto mb-24"
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Comment ça marche
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <StepCard
                number={1}
                title="S'inscrire"
                description="Créez votre compte en quelques secondes avec juste votre email"
                icon={<Users className="w-10 h-10 text-[#7ED957]" />}
                delay={0.2}
              />
              <StepCard
                number={2}
                title="Rejoignez votre quartier"
                description="Entrez votre adresse pour vous connecter avec votre communauté locale"
                icon={<MessageCircle className="w-10 h-10 text-[#7ED957]" />}
                delay={0.4}
              />
              <StepCard
                number={3}
                title="Commencer à discuter"
                description="Instantly connect with neighbors and local events"
                icon={<Calendar className="w-10 h-10 text-[#7ED957]" />}
                delay={0.6}
              />
            </div>
          </motion.section>

          {/* Testimonials Section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto mb-24"
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Ce que disent les voisins
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <TestimonialCard
                quote="Nova Connect m'a permis de trouver un groupe de jardinage local. Maintenant, nous nous rencontrons chaque week-end!"
                name="Mohamed K."
                location="Aulnay-sous-Bois"
                delay={0.2}
              />
              <TestimonialCard
                quote="Je suis nouveau dans la région et ne connaissais personne. Maintenant, j'ai des amis juste à côté de chez moi."
                name="Bilel B."
                location="Gagny"
                delay={0.4}
              />
              <TestimonialCard
                quote="Quand mon chien a disparu, mes voisins ont réuni leurs forces pour le retrouver grâce à Nova Connect."
                name="Moussa T."
                location="Torcy"
                delay={0.6}
              />
            </div>
          </motion.section>

          {/* Benefits Section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto mb-24 bg-white rounded-2xl p-10 shadow-xl"
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Pourquoi rejoindre Nova Connect?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <BenefitCard
                title="Se sentir plus sûr"
                description="Restez informé sur la sécurité de votre quartier et connectez-vous avec vos voisins pour un soutien mutuel"
                icon={<Shield className="w-8 h-8 text-[#7ED957]" />}
                delay={0.2}
              />
              <BenefitCard
                title="Restez informé"
                description="Restez informé sur les actualités locales, les événements et les annonces importantes de la communauté"
                icon={<Info className="w-8 h-8 text-[#7ED957]" />}
                delay={0.3}
              />
              <BenefitCard
                title="Faire des connexions"
                description="Rencontrez des personnes qui vivent à proximité et formez des relations significatives"
                icon={<Heart className="w-8 h-8 text-[#7ED957]" />}
                delay={0.4}
              />
              <BenefitCard
                title="Découvrez les événements locaux"
                description="Trouvez et rejoignez les rassemblements communautaires, des fêtes de quartier aux marchés agricoles"
                icon={<Calendar className="w-8 h-8 text-[#7ED957]" />}
                delay={0.5}
              />
            </div>
          </motion.section>

          {/* Call to Action */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-20"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Rejoignez votre quartier aujourd'hui
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Connectez-vous avec votre communauté en un clic!
            </p>
            <Link href="/auth/register">
              <button className="px-10 py-4 cursor-pointer rounded-full bg-[#7ED957] text-white font-semibold text-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] flex items-center justify-center gap-2 mx-auto">
                S'inscrire maintenant <ArrowRight size={20} />
              </button>
            </Link>
          </motion.section>
        </main>

        <footer className="text-center text-gray-500 py-8">
          <p>© 2025 Nova Connect. Tous droits réservés.</p>
        </footer>
      </div>
    </div>
  );
}
