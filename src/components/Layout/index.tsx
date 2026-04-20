import Header from '../Header'
import Navbar from '../Navbar'


const LayoutDashboard = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Header />
            <Navbar children={undefined} title={''} />
            {children}
        </div>
    )
}

export default LayoutDashboard