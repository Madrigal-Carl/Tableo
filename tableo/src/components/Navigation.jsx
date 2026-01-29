import logo from '../assets/tb logo.png'

function Navigation() {
    return (
        <>
            <nav className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-white shadow-md z-50">
            <img src={logo} alt="Tableo Logo" className="w-30" />
            <div className="flex space-x-6 items-center">
                <h2 className="text-xl font-bold">
                About us
                </h2>
                <button className="bg-[#52ab98] text-base text-white px-6 py-3 rounded-lg hover:bg-[#3f8f7f] font-bold">
                Get Started
                </button>
            </div>
            </nav>
        </>
    )
}
export default Navigation