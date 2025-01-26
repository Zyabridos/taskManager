export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto py-6 flex items-center justify-between">
        <p className="text-lg font-semibold">Nina Zyabrina</p>
        <a
          className="ml-4 text-blue-400 hover:text-blue-500 transition duration-300"
          target="_blank"
          href="https://github.com/zyabridos"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
