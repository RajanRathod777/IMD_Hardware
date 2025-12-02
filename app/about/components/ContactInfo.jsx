"use client";
import { Phone, Mail, MapPin } from 'lucide-react';

const ContactInfo = () => {
  const contactMethods = [
    { icon: Phone, title: "Phone", details: "+1 (555) 123-4567" },
    { icon: Mail, title: "Email", details: "support@hardwarepro.com" },
    { icon: MapPin, title: "Address", details: "123 Hardware Street, Industrial Park" }
  ];

  return (
    <section className="mb-16 bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Get In Touch</h2>
      <div className="grid md:grid-cols-3 gap-8 text-center">
        {contactMethods.map((method, index) => {
          const IconComponent = method.icon;
          return (
            <div key={index} className="flex flex-col items-center">
              <IconComponent className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold mb-2">{method.title}</h3>
              <p className="text-gray-600">{method.details}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ContactInfo;