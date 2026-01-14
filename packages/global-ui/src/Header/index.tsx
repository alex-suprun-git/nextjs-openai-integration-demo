const Header = ({ children }: { children: React.ReactNode }) => (
	<div
		data-testid="header"
		className="navbar border-black/10 bg-gray-900 px-5 py-5 md:px-10 lg:h-[80px] lg:py-0">
		<div className="container flex mx-auto">{children}</div>
	</div>
);
export default Header;
