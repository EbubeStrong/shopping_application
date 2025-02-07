import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";



function ShoppingLayout() {
    return ( 
        <div className="flex flx-col bg-white overflow-hidden">
            <ShoppingHeader />
            <main className="flex flex-col-w-full">
                <Outlet />
            </main>
        </div>
     );
}

export default ShoppingLayout;