import Navbar from "./component/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className=" flex flex-col">
                <Navbar />
                <div className="flex-1 pt-16"> {/* Adjust padding to match the height of the navbar */}
                    {children}
                </div>
            </div>
        </div>
    );
}
