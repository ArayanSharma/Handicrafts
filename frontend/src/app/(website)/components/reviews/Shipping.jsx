import {
  Package,
  BadgeCheck,
  MessageCircle,
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Package size={24} />,
      title: "Free Shipping",
      description:
        "Enjoy free PAN India Delivery within 5 to 7 Days",
    },
    {
      icon: <BadgeCheck size={24} />,
      title: "Free Returns",
      description:
        "Free returns within 3 days, please make sure the items are in undamaged condition.",
    },
    {
      icon: <MessageCircle size={24} />,
      title: "Support Online",
      description:
        "We support customers from 10AM to 6 PM, send questions we will solve for you immediately.",
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-3 gap-10 text-center">

          {features.map((item, index) => (
            <div key={index}>

              <div className="flex justify-center mb-4 text-gray-700">
                {item.icon}
              </div>

              <h3 className="font-semibold text-lg mb-3">
                {item.title}
              </h3>

              <p className="text-gray-600 text-sm leading-7 max-w-xs mx-auto">
                {item.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}