import MainLayout from "./MainLayout";


export default function Error(){
    return(
        <MainLayout>
            <div className="container" style={{minHeight:'400px'}}>
                <div className="icon-warning mx-auto" style={{width:'150px'}}>
                    <img src="/icons/warning-sign.svg" alt=""/>
                </div>
                <h2 className="text-center mt-5">Something went wrong!
                    reload the page or try again later</h2>
            </div>
        </MainLayout>
    )
}
