import Link from "next/link";
import { Phone, Mail, MapPin, Clock3 } from "lucide-react";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="mt-16 border-t border-amber-200 bg-white text-gray-700">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
                {/* Brand Info */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Janhavi <span className="text-amber-600">Beer Shop</span>
                    </h2>
                    <p className="mt-4 text-sm leading-6 text-gray-600">
                        Your trusted beer shop for quick billing, smart stock management,
                        barcode scanning, and smooth customer service.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
                    <ul className="mt-4 space-y-3 text-sm">
                        <li>
                            <Link href="/" className="transition hover:text-amber-600">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/stock" className="transition hover:text-amber-600">
                                Stock Management
                            </Link>
                        </li>
                        <li>
                            <Link href="/billing" className="transition hover:text-amber-600">
                                Billing
                            </Link>
                        </li>
                        <li>
                            <Link href="/scan" className="transition hover:text-amber-600">
                                Scan Beer
                            </Link>
                        </li>
                        <li>
                            <Link href="/reports" className="transition hover:text-amber-600">
                                Reports
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
                    <ul className="mt-4 space-y-4 text-sm">
                        <li className="flex items-start gap-3">
                            <Phone className="mt-0.5 h-4 w-4 text-amber-600" />
                            <span>+91 98765 43210</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Mail className="mt-0.5 h-4 w-4 text-amber-600" />
                            <span>janhavibeershop@gmail.com</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <MapPin className="mt-0.5 h-4 w-4 text-amber-600" />
                            <span>Mumbai, Maharashtra, India</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Clock3 className="mt-0.5 h-4 w-4 text-amber-600" />
                            <span>Open Daily: 10:00 AM - 11:00 PM</span>
                        </li>
                    </ul>
                </div>

                {/* Social Links */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Follow Us</h3>
                    <div className="mt-4 flex gap-3">
                        <Link
                            href="#"
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-600 transition hover:bg-amber-100 hover:text-amber-700"
                        >
                            <FaInstagram className="h-5 w-5" />
                        </Link>
                        <Link
                            href="#"
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-600 transition hover:bg-amber-100 hover:text-amber-700"
                        >
                            <FaFacebookF className="h-5 w-5" />
                        </Link>
                        <Link
                            href="https://wa.me/919876543210"
                            target="_blank"
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-green-200 bg-green-50 text-green-600 transition hover:bg-green-100 hover:text-green-700"
                        >
                            <FaWhatsapp className="h-5 w-5" />
                        </Link>
                    </div>

                    <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                        <p className="text-sm text-gray-600">
                            Fast billing, barcode scan, stock updates, and daily sales tracking
                            made simple for your shop.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-amber-100 bg-amber-50/60">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-sm text-gray-600 sm:px-6 lg:flex-row lg:px-8">
                    <p>© {new Date().getFullYear()} Janhavi Beer Shop. All rights reserved.</p>
                    <p className="text-center">
                        Built with <span className="font-semibold text-amber-600">Next.js</span> &{" "}
                        <span className="font-semibold text-amber-600">Tailwind CSS</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}