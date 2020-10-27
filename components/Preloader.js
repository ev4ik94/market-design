import MainLayout from "./MainLayout";

export const Preloader = () => (
   <MainLayout>
        <div className="d-flex justify-content-center pt-5" style={{minHeight:'400px'}}>
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
   </MainLayout>
    
);

export const PreloaderComp = () => (

        <div className="d-flex justify-content-center pt-5" style={{minHeight:'400px'}}>
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>


);


