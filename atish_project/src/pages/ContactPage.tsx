import { SectionHeader } from "../components/ui/SectionHeader";
import { Seo } from "../components/Seo";

const ContactPage = () => {
  return (
    <div className="page-container py-12 space-y-8">
      <Seo
        title="Contact Us | FuturePath 3D"
        description="Get in touch with FuturePath 3D for career guidance queries and support."
      />
      <SectionHeader
        eyebrow="Reach Out"
        title="Contact Us"
        subtitle="Have a question? Let us know how we can help you out."
      />

      <div className="glass-panel rounded-xl border border-gray-200 bg-white p-8 max-w-2xl text-center flex flex-col items-center justify-center gap-4 mx-auto mt-10">
        <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
        <p className="text-gray-600">
          We're here to help! Please email us at <a href="mailto:admin@career.com" className="font-semibold text-black hover:underline">admin@career.com</a> with your queries.
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
