import SideBar from "./components/SideBar";
import Logout from "./components/Logout";
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <div>
                <SideBar/>
                <div className="w-screen min-h-screen pl-[5rem] flex items-center justify-center">
                    <div className="p-3 rounded-md bg-gray-300 h-[70vh] w-[60vw]">
                    <Logout/>
                    {children}
                    </div>
                </div>
                </div>
        </div>
    );
}