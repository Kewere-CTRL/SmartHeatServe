import Header from "../components/Menu/Header.tsx";
import Breadcrumbs from "../components/Menu/Breadcrumbs.tsx";

const DefaultLayout = ({ children }) => {
    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden">
            <Header />
            <div className="flex flex-grow overflow-hidden">
                <div className="flex flex-col flex-grow overflow-hidden">
                    <Breadcrumbs className="w-full" />
                    <div className="flex-grow mt-2 ml-4 overflow-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DefaultLayout;

