import React from "react";
import {
  Home,
  Briefcase,
  Navigation,
  Package,
  Hammer,
  Warehouse,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import Service from "@/models/Service";

// Helper to get service icon based on slug
const getServiceIcon = (slug) => {
  switch (slug) {
    case "residential-moving":
      return <Home className="h-6 w-6" />;
    case "commercial-office-moves":
      return <Briefcase className="h-6 w-6" />;
    case "long-distance-relocations":
      return <Navigation className="h-6 w-6" />;
    case "professional-packing-services":
      return <Package className="h-6 w-6" />;
    case "furniture-disassembly-assembly":
      return <Hammer className="h-6 w-6" />;
    case "secure-storage-solutions":
      return <Warehouse className="h-6 w-6" />;
    default:
      return <MapPin className="h-6 w-6" />;
  }
};

export default async function Services() {
  let dbServices = [];
  try {
    dbServices = await Service.findAll({ order: [["name", "ASC"]], limit: 6 });
  } catch (err) {
    console.error("Error loading services list for public page:", err);
  }

  // Fallback services in case DB is empty or fails
  const fallbackServices = [
    {
      icon: <Home className="h-6 w-6" />,
      title: "Residential Moving",
      slug: "residential-moving",
      description:
        "Whether it is a cozy studio, a high-rise condo, or a spacious family home, our crew handles your personal belongings with extreme care.",
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Commercial & Office Moves",
      slug: "commercial-office-moves",
      description:
        "Streamline your business relocation. We safely transport IT infrastructure, heavy machinery, office desks, and sensitive archives with zero downtime.",
    },
    {
      icon: <Navigation className="h-6 w-6" />,
      title: "Long Distance Relocations",
      slug: "long-distance-relocations",
      description:
        "Reliable cross-provincial moving. Our structured freight networks and dedicated long-haul trucks connect communities coast to coast.",
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Professional Packing Services",
      slug: "professional-packing-services",
      description:
        "Delegate the wrap and seal. We bring premium double-walled moving boxes, bubble sheets, packing paper, and specialty glass protection.",
    },
    {
      icon: <Hammer className="h-6 w-6" />,
      title: "Furniture Disassembly & Assembly",
      slug: "furniture-disassembly-assembly",
      description:
        "Skip the Allen keys. Our team disassembles complex bed frames, modular wardrobes, and desks, then re-assembles them perfectly at your destination.",
    },
    {
      icon: <Warehouse className="h-6 w-6" />,
      title: "Secure Storage Solutions",
      slug: "secure-storage-solutions",
      description:
        "Flexible short and long-term storage vault options in our modern, climate-controlled, 24/7 CCTV protected national warehouse spaces.",
    },
  ];

  const servicesToRender = dbServices.length > 0
    ? dbServices.map((s) => ({
        icon: getServiceIcon(s.slug),
        title: s.name,
        slug: s.slug,
        description: s.description,
      }))
    : fallbackServices;

  return (
    <section
      id="services"
      className="bg-gray-50 py-20 lg:py-28 relative scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-red-600 font-extrabold text-xs uppercase tracking-widest bg-red-50 py-1.5 px-3.5 rounded-full inline-block">
            Our Expertise
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Complete Moving Solutions
          </h2>
          <div className="w-12 h-1 bg-red-600 mx-auto rounded-full"></div>
          <p className="text-base text-gray-500 font-medium">
            From local packing to cross-country transit, we offer fully
            customizable services tailored to your exact timelines and budget.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesToRender.map((service, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 hover:border-red-100 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-5">
                <div className="bg-red-50 text-red-600 p-4 rounded-xl w-fit group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                </div>
                <h3 className="font-extrabold text-gray-900 text-xl tracking-tight leading-snug">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-50">
                <Link
                  href={"#"}
                  className="text-red-600 hover:text-red-700 font-bold text-xs uppercase tracking-wider flex items-center"
                >
                  <span>Learn More</span>
                  <span className="ml-1.5 group-hover:translate-x-1.5 transition-transform duration-200">
                    &rarr;
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
