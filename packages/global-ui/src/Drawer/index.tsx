'use client';

import {
	createContext,
	Dispatch,
	ReactElement,
	ReactNode,
	RefObject,
	SetStateAction,
} from 'react';
import { FiX } from 'react-icons/fi';

interface DrawerContextProps {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const DrawerContext = createContext<DrawerContextProps | undefined>(
	undefined
);

const Drawer = ({
	icon,
	toggleRef,
	children,
}: {
	icon: ReactElement;
	toggleRef: RefObject<HTMLInputElement | null>;
	children: ReactNode;
}) => (
	<div className="drawer">
		<input
			ref={toggleRef}
			id="drawerMobile"
			type="checkbox"
			className="drawer-toggle"
		/>
		<div className="drawer-content">
			<label htmlFor="drawerMobile" className="drawer-button ">
				{icon}
			</label>
		</div>
		<div className="drawer-side z-20">
			<label
				htmlFor="drawerMobile"
				aria-label="close sidebar"
				className="drawer-overlay"></label>
			<div className="menu min-h-full w-80 bg-slate-800 p-4 ">
				<div className="flex justify-end">
					<label
						htmlFor="drawerMobile"
						className="cursor-pointer p-2 hover:text-gray-300">
						<FiX size={24} />
					</label>
				</div>
				{children}
			</div>
		</div>
	</div>
);

export default Drawer;
