import withAuth from '../Protected/withAuth';

const PageSection = ({ title, children }) => (
  <div className="mx-auto max-w-7xl px-4 py-8">
    <h2 className="mb-6 text-6xl font-bold text-gray-800">{title}</h2>
    {children}
  </div>
);

export default withAuth(PageSection);
