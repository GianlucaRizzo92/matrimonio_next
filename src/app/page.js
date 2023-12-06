
import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to My Next.js App</h1>
      <nav>
        <Link href="/table">
          <a>Form Data</a>
        </Link>
      </nav>
    </div>
  );
};

export default HomePage;