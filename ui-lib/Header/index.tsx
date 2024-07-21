const Header = ({ children }: { children: React.ReactNode }) => (
  <div
    data-testid="header"
    className="navbar border-black/10 bg-gray-900 px-10 py-5 md:items-center lg:h-[80px] lg:py-0"
  >
    {children}
  </div>
);
export default Header;
