import { ReactNode } from 'react';
import Link from 'next/link';

function BreadcrumbsItem({
	children,
	href,
}: {
	children: ReactNode;
	href?: string;
}) {
	if (href) {
		return (
			<li>
				<Link href={href}>{children}</Link>
			</li>
		);
	}

	return <li>{children}</li>;
}

export default BreadcrumbsItem;
