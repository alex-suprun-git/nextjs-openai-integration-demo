import { ReactNode } from 'react';

function Breadcrumbs({ children }: { children: ReactNode }) {
	return (
		<div className="breadcrumbs text-sm mb-12">
			<ul>{children}</ul>
		</div>
	);
}

export default Breadcrumbs;
