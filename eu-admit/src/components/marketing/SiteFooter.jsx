// SiteFooter.jsx
// Renders a simple marketing footer with navigation links and copyright.
import { Link } from 'react-router-dom';
import Container from '../layout/Container.jsx';

const footerLinks = [
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy', label: 'Privacy' },
];

const SiteFooter = () => (
  <footer className="border-t border-slate-200 bg-white py-10">
    <Container className="flex flex-col gap-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-semibold text-slate-800">© {new Date().getFullYear()} UniPath. All rights reserved.</p>
      <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
        {footerLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="transition hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </Container>
  </footer>
);

export default SiteFooter;
