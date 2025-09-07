import HomeRightComponent from "@/src/components/home/HomeRightComponent";
import SidePanel from "@/src/components/home/SidePanel";
import HomeNavbar from "@/src/components/navbars/HomeNavbar";

export default async function Home() {
    return (
        <div className="h-screen w-screen flex overflow-hidden">
            <HomeNavbar />
            <SidePanel />
            <div className="flex-1 text-neutral-200 pt-30">
                <HomeRightComponent />
            </div>
        </div>
    );
}
