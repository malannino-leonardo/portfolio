import { EXPERIENCE, SkillNames, SKILLS } from "@/data/constants";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import SectionWrapper from "@/components/ui/section-wrapper";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const AboutSection = () => {
  return (
    <SectionWrapper id="about" className="min-h-screen py-20 z-10 overflow-hidden">
      <div className="w-full max-w-7xl px-6 md:px-10 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20">
          
          {/* Left Column: Profile & Header (Sticky) */}
          <div className="flex flex-col gap-8 lg:sticky lg:top-32 h-fit text-center lg:text-left order-first">
            
            {/* Profile Photo */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5 }}
               className="relative mx-auto lg:mx-0 w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full border-[6px] border-background shadow-2xl overflow-hidden ring-1 ring-border"
            >
              <Image 
                src="/assets/me.png" 
                alt="Profile Photo" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
              />
            </motion.div>

            {/* Header Text */}
            <div className="space-y-4">
               <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
               >
                  <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                    About
                  </h2>
               </motion.div>
               <motion.p 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.2 }}
                 className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto lg:mx-0"
               >
                 I&apos;m a full-stack developer obsessed with building cool stuff on the web. I love playing with 3D, animations, 
                 and creating experiences that actually make people go &ldquo;wow&rdquo;. Always tinkering, always experimenting.
               </motion.p>
            </div>
          </div>

          {/* Right Column: Timeline */}
          <div className="relative flex flex-col gap-12 lg:pt-4 w-full">
            
             {/* Timeline Vertical Line */ }
             <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden md:block" />

            {EXPERIENCE.map((exp, index) => (
               <AboutCard key={exp.id} experience={exp} index={index} />
            ))}
          </div>

        </div>
      </div>
    </SectionWrapper>
  );
};

const AboutCard = ({
  experience,
  index,
}: {
  experience: (typeof EXPERIENCE)[0];
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      viewport={{ once: true, margin: "-50px" }}
      className="relative md:pl-12 group"
    >
       {/* Timeline Dot */}
       <div className="absolute left-[11px] top-8 w-4 h-4 rounded-full border-2 border-primary bg-background z-10 hidden md:block group-hover:bg-primary transition-colors duration-300" />
      
      <Card
        className={cn(
          "bg-card/50 backdrop-blur-sm text-card-foreground border-border/50",
          "hover:border-primary/50 transition-all duration-300",
          "hover:shadow-lg hover:-translate-y-1"
        )}
      >
        <CardHeader>
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
             <div>
                <CardTitle className="text-xl md:text-2xl font-bold">{experience.title}</CardTitle>
                <p className="text-primary font-medium">{experience.company}</p>
             </div>
             <Badge variant="secondary" className="w-fit text-sm whitespace-nowrap">
               {experience.startDate} - {experience.endDate}
             </Badge>
           </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="list-disc list-outside ml-4 space-y-2 text-muted-foreground text-sm md:text-base">
            {experience.description.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            {experience.skills.map((skillName) => {
              const skill = SKILLS[skillName as SkillNames];
              if (!skill) return null;
              return (
                <Badge
                  key={skillName}
                  variant="outline"
                  className="gap-2 text-xs font-normal bg-secondary/20 hover:bg-secondary/40 transition-colors py-1"
                >
                  <Image
                    src={skill.icon}
                    alt={skill.label}
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                  {skill.label}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AboutSection;
