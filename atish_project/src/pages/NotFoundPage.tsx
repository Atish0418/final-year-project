import { Button } from "../components/ui/Button";
import { Seo } from "../components/Seo";

const NotFoundPage = () => {
  return (
    <div className="page-container py-20 flex flex-col items-center text-center gap-4">
      <Seo title="Page not found" description="The page you are looking for does not exist." />
      <p className="text-sm text-primary uppercase tracking-[0.2em]">404</p>
      <h1 className="text-3xl font-semibold text-gray-900">Path not found</h1>
      <p className="text-gray-600 max-w-md">
        The route you tried to enter doesn&apos;t exist yet. Choose a program or head back to the main hub.
      </p>
      <div className="flex gap-3">
        <Button as="a" href="#/">Return home</Button>
        <Button variant="outline" as="a" href="#contact">
          Contact team
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
