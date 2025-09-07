'use client';

import { cn } from '@/src/lib/utils';
import NavItems from './NavItems';
import NavbarSigninAction from './NavbarSignAction';

const navItems = [
    { name: 'Features', link: '#features' },
    { name: 'Pricing', link: '#pricing' },
    { name: 'Contact', link: '#contact' },
];

export default function Navbar() {

    return (
        <div
            className={cn('fixed left-1/2 -translate-x-1/2 px-4 py-4 z-[100] ',
                'transition-all duration-500 ease-in-out rounded-2xl',
                'top-4 border border-neutral-600 shadow-lg bg-gradient-to-b from-[#1c1c1c] via-neutral-900/90 to-[#1c1c1c] backdrop-blur-sm '
            )}
            style={{
                maxWidth: '56rem',
                width: '100%',
                transition: 'max-width 0.6s ease, top 0.4s ease',
            }}
        >
            <div className="px-4 flex items-center justify-between w-full">
                UniLink

                <div className="flex">
                    <NavItems items={navItems} />
                </div>

                <NavbarSigninAction />
            </div>
        </div>
    );
}
