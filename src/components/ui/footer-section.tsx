'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface FooterLink {
	title: string;
	href: string;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const footerLinks: FooterSection[] = [
	{
		label: '关于我们',
		links: [
			{ title: '用户协议', href: '/terms' },
			{ title: '隐私保护', href: '/privacy' },
			{ title: '商务合作', href: '/cooperation' },
		],
	},
	{
		label: '产品',
		links: [
			{ title: '买币', href: '/buy' },
			{ title: '现货', href: '/spot' },
			{ title: '合约', href: '/futures' },
			{ title: '跟单', href: '/copy-trading' },
			{ title: '理财', href: '/wealth' },
		],
	},
	{
		label: '服务',
		links: [
			{ title: '费率说明', href: '/fees' },
			{ title: '常见问题', href: '/faq' },
			{ title: '官方验证通道', href: '/verify' },
			{ title: '上币申请', href: '/listing' },
		],
	},
];

export function Footer() {
	return (
		<footer 
			className="relative w-full flex flex-col items-center justify-center border-t border-white/10 bg-black px-6 py-12 lg:py-16 shadow-[0_-10px_40px_rgba(0,0,0,0.3),0_-5px_20px_rgba(0,0,0,0.2)]"
			style={{
				borderTopLeftRadius: '24px',
				borderTopRightRadius: '24px',
				maxWidth: '1536px',
				margin: '0 auto'
			}}
		>
			<div className="bg-white/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

			<div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
				<AnimatedContainer className="space-y-4">
					<img 
						src="https://cy-747263170.imgix.net/logo.1730b8a9.gif" 
						alt="MGBX Logo" 
						className="h-16 w-auto"
					/>
					<p className="text-gray-400 mt-8 text-sm md:mt-0">
						© {new Date().getFullYear()} MGBX. All rights reserved.
					</p>
				</AnimatedContainer>

				<div className="mt-10 grid grid-cols-3 gap-8 xl:col-span-2 xl:mt-0">
					{footerLinks.map((section, index) => (
						<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
							<div className="mb-10 md:mb-0">
								<h3 className="text-sm text-white font-semibold mb-4">{section.label}</h3>
								<ul className="text-gray-400 space-y-2 text-sm">
									{section.links.map((link) => (
										<li key={link.title}>
											<a
												href={link.href}
												className="hover:text-white transition-all duration-300"
											>
												{link.title}
											</a>
										</li>
									))}
								</ul>
							</div>
						</AnimatedContainer>
					))}
				</div>
			</div>
		</footer>
	);
};

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return children;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
};

