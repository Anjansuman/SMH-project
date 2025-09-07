import Navbar from "@/src/components/navbars/Navbar";
import { BackgroundBeams } from "@/src/components/ui/background-beams";
import { HeroParallaxDemo } from "@/src/data/HomeProduct";
import { Copyright } from "lucide-react";

export default function Page() {
    return (
        <>
            {/* Background beams isolated */}
            <div className="fixed inset-0 -z-10">
                <BackgroundBeams />
            </div>

            {/* Content layer */}
            <div className="relative z-0 min-h-screen ">
                <Navbar />

                {/* Test content to verify styles work */}
                <main className="pt-24 px-4 relative z-50">
                    <div>
                        <HeroParallaxDemo />
                    </div>
                    <div className="w-full h-30 border-t border-neutral-800 relative z-50 flex flex-col justify-center items-center gap-y-3 text-neutral-300/40 ">
                        <div className="flex justify-center items-center gap-x-5 ">
                            <div>
                                Twitter
                            </div>
                            <div>
                                Instagram
                            </div>
                            <div>
                                LinkedIn
                            </div>
                        </div>
                        <div className="flex gap-x-2 ">
                            <Copyright />
                            2025 UniLink. All rights reserved.
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}