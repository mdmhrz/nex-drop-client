'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Share2, Mail, Globe, PlayCircle, ArrowRight, Package } from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from '@/components/shared/logo';
import { authService } from '@/services/auth.service';

const MotionLink = motion(Link);

const footerSections = {
    features: {
        title: 'Features',
        links: [
            { label: 'Track Order', href: '/track-order' },
            { label: 'Coverage', href: '/coverage' },
            { label: 'Payment', href: '/payment' },
        ],
    },
    company: {
        title: 'Company',
        links: [
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'Be a Rider', href: '/be-a-rider' },
        ],
    },
};

const socialLinks = [
    {
        name: 'LinkedIn',
        icon: Share2,
        url: '#',
        color: 'hover:text-blue-600',
    },
    {
        name: 'Email',
        icon: Mail,
        url: 'mailto:support@nexdrop.com',
        color: 'hover:text-red-500',
    },
    {
        name: 'Website',
        icon: Globe,
        url: '#',
        color: 'hover:text-primary',
    },
    {
        name: 'YouTube',
        icon: PlayCircle,
        url: '#',
        color: 'hover:text-red-600',
    },
];

const paymentMethods = [
    {
        name: 'Stripe',
        path: '/payment-methods/stripe.svg',
    },
    {
        name: 'SSLCommerz',
        path: '/payment-methods/sslcommerz.svg',
    },
];

const Footer = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    const buttonVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, delay: 0.4 },
        },
    };

    const handleSendParcelClick = async () => {
        try {
            setIsLoading(true);
            // Check if user is authenticated
            await authService.getMe();
            // If successful, redirect to create parcel
            router.push('/dashboard/create-parcel');
        } catch (error) {
            console.log(error, "Error fetching user data");
            // If error, user is not authenticated
            toast.error('Please login first', {
                description: 'You need to be logged in to send a parcel.',
            });
            // Optionally redirect to login
            router.push('/login?redirect=/dashboard/create-parcel');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <footer className="bg-linear-to-b from-foreground to-black dark:from-muted/50 dark:to-background text-background dark:text-foreground mt-20">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={containerVariants}
                className="max-w-7xl mx-auto px-6"
            >
                {/* Main Footer Content */}
                <div className="py-12 md:py-16">
                    {/* CTA Section at Top */}
                    <motion.div variants={buttonVariants} className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border border-primary/30 backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                    Ready to send a parcel?
                                </h2>
                                <p className="text-slate-300">
                                    Fast, secure, and reliable delivery at your fingertips.
                                </p>
                            </div>
                            <motion.button
                                onClick={handleSendParcelClick}
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 disabled:bg-slate-400 disabled:cursor-not-allowed text-slate-900 font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl whitespace-nowrap"
                            >
                                <Package className="w-5 h-5" />
                                {isLoading ? 'Redirecting...' : 'Send Your Parcel Now'}
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Logo & Links Section */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                        {/* Left: Logo, Description, Social */}
                        <div>
                            <div className="mb-6">
                                <Logo />
                            </div>
                            <p className="text-sm leading-relaxed text-slate-400 mb-6 max-w-sm">
                                Transforming parcel delivery with real-time tracking, secure handling, and guaranteed on-time delivery across Bangladesh.
                            </p>
                            {/* Social Links */}
                            <div className="flex gap-3">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <motion.a
                                            key={social.name}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 transition-all duration-300 ${social.color} hover:bg-slate-700`}
                                            aria-label={social.name}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </motion.a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right: Footer Links */}
                        <div className="grid grid-cols-2 gap-8">
                            {Object.entries(footerSections).map(([key, section]) => (
                                <div key={key}>
                                    <h3 className="font-semibold text-white text-sm mb-4">
                                        {section.title}
                                    </h3>
                                    <ul className="space-y-3">
                                        {section.links.map((link) => (
                                            <li key={link.href}>
                                                <MotionLink
                                                    href={link.href}
                                                    whileHover={{ x: 3 }}
                                                    className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                                                >
                                                    {link.label}
                                                </MotionLink>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Payment Methods */}
                    <motion.div variants={itemVariants} className="mb-8 pt-8 border-t border-slate-800">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-slate-500">
                                <span className="font-medium text-slate-400">Payment Methods:</span>
                            </div>
                            <div className="flex gap-4">
                                {paymentMethods.map((method) => (
                                    <motion.div
                                        key={method.name}
                                        whileHover={{ scale: 1.05 }}
                                        className={`relative h-8 overflow-hidden flex items-center justify-center ${method.name === 'Stripe' ? 'w-16' : 'w-24'}`}
                                        title={method.name}
                                    >
                                        <Image
                                            src={method.path}
                                            alt={method.name}
                                            width={method.name === 'Stripe' ? 64 : 96}
                                            height={method.name === 'Stripe' ? 20 : 24}
                                            className="object-contain h-full w-full opacity-80 hover:opacity-100 transition-opacity"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Bottom Bar */}
                    <motion.div
                        variants={itemVariants}
                        className="pt-8 border-t border-slate-800"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                            <div>
                                © {new Date().getFullYear()} NexDrop. All rights reserved.
                            </div>
                            <div className="flex gap-6">
                                <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
                                    Privacy Policy
                                </Link>
                                <Link href="/terms-of-service" className="hover:text-slate-300 transition-colors">
                                    Terms of Service
                                </Link>
                                <Link href="/cookie-policy" className="hover:text-slate-300 transition-colors">
                                    Cookie Policy
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </footer>
    );
};

export default Footer;
