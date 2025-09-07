import Navbar from "@/src/components/navbars/Navbar";
import { BackgroundBeams } from "@/src/components/ui/background-beams";

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
                <main className="pt-24 px-4">
                    <div>
                        
                    </div>
                </main>
            </div>
        </>
    );
}