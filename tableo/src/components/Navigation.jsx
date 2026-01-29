import logo from '../assets/logo.png'

function Navigation() {
    return (
        <>
            <nav className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-white shadow-md z-50">
            <img src={logo} alt="Tableo Logo" className="w-30" />
            <div className="flex space-x-6 items-center">
                <button className="text-xl font-bold">
                About us
                </button>
                <button className="bg-[#FA824C] text-base text-white px-6 py-3 rounded-3xl hover:bg-[#FF9768] font-bold">
                Get Started
                </button>
            </div>
            </nav>
        </>
    )
}
export default Navigation