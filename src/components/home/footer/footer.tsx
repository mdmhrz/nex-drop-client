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
                <div className="py-16 md:py-20">
                    {/* CTA & Logo Section - Reorganized for mobile/desktop */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 order-first md:order-0">
                        {/* Order: Mobile shows CTA first, Desktop shows Logo first */}
                        <div className="order-2 md:order-1">
                            {/* Logo Section */}
                            <div className="mb-8">
                                <div className="mb-6">
                                    <Logo />
                                </div>
                                <p className="text-sm leading-relaxed text-background/75 dark:text-foreground/75 mb-8 max-w-xs">
                                    Transforming parcel delivery with real-time tracking, secure handling, and guaranteed on-time delivery.
                                </p>

                                {/* Social Links */}
                                <div className="flex items-center gap-3 mb-8">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-background/60 dark:text-foreground/60">
                                        Connect
                                    </span>
                                    <div className="flex gap-3">
                                        {socialLinks.map((social) => {
                                            const Icon = social.icon;
                                            return (
                                                <motion.a
                                                    key={social.name}
                                                    href={social.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    whileHover={{ scale: 1.2, y: -4 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className={`w-10 h-10 rounded-lg bg-background/10 dark:bg-foreground/10 flex items-center justify-center text-background dark:text-foreground transition-all duration-300 ${social.color} border border-background/20 dark:border-foreground/20`}
                                                    aria-label={social.name}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                </motion.a>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* We Support - Payment Methods */}
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-background dark:text-foreground mb-4">
                                        We Support
                                    </h3>
                                    <div className="flex gap-4">
                                        {paymentMethods.map((method) => (
                                            <motion.div
                                                key={method.name}
                                                whileHover={{ scale: 1.1 }}
                                                className={`relative h-10 overflow-hidden flex items-center justify-center ${method.name === 'Stripe' ? 'w-20' : 'w-32'
                                                    }`}
                                                title={method.name}
                                            >
                                                <Image
                                                    src={method.path}
                                                    alt={method.name}
                                                    width={method.name === 'Stripe' ? 80 : 160}
                                                    height={method.name === 'Stripe' ? 24 : 32}
                                                    className="object-contain h-full w-full"
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section - Mobile shows first, Desktop shows on right */}
                        <motion.div variants={buttonVariants} className="order-1 md:order-2 flex flex-col justify-center items-center md:items-start text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-background dark:text-foreground">
                                Ready to send a parcel?
                            </h2>
                            <p className="text-background/75 dark:text-foreground/75 mb-8 max-w-lg">
                                Get your package delivered fast and securely. Track in real-time and enjoy peace of mind.
                            </p>
                            <motion.button
                                onClick={handleSendParcelClick}
                                disabled={isLoading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-primary-foreground font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <Package className="w-5 h-5" />
                                {isLoading ? 'Redirecting...' : 'Send Your Parcel Now'}
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </motion.div>
                    </motion.div>


                    {/* Links Grid */}
                    <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-16 py-8 border-y border-background/10 dark:border-foreground/10">
                        {Object.entries(footerSections).map(([key, section]) => (
                            <div key={key}>
                                <h3 className="font-bold text-sm uppercase tracking-widest text-background dark:text-foreground mb-6">
                                    {section.title}
                                </h3>
                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link.href}>
                                            <MotionLink
                                                href={link.href}
                                                whileHover={{ x: 4 }}
                                                className="text-sm text-background/70 dark:text-foreground/70 hover:text-background dark:hover:text-foreground transition-colors duration-300"
                                            >
                                                {link.label}
                                            </MotionLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </motion.div>

                    {/* Bottom Bar */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-background/60 dark:text-foreground/60"
                    >
                        <div>
                            © {new Date().getFullYear()} NexDrop. All rights reserved
                        </div>
                        <div className="flex gap-6">
                            <Link href="/privacy-policy" className="hover:text-background dark:hover:text-foreground transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms-of-service" className="hover:text-background dark:hover:text-foreground transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/cookie-policy" className="hover:text-background dark:hover:text-foreground transition-colors">
                                Cookie Policy
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </footer>
    );
};

export default Footer;
