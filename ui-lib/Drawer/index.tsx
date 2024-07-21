import { ReactElement, ReactNode } from 'react';

const Drawer = ({ icon, children }: { icon: ReactElement; children: ReactNode }) => (
  <div className="drawer">
    <input id="my-drawer" type="checkbox" className="drawer-toggle" />
    <div className="drawer-content">
      <label htmlFor="my-drawer" className="drawer-button">
        {icon}
      </label>
    </div>
    <div className="drawer-side z-20">
      <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
      <div className="menu min-h-full w-80 bg-base-200 p-4 text-base-content">{children}</div>
    </div>
  </div>
);

export default Drawer;
