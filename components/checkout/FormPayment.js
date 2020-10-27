import {useState} from "react";

export function FormPayment(){

    const [name, setName] = useState('');
    const [lastName, setlastName] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [postCode, setPostCode] = useState('');

    return(
        <div style={{marginTop:'150px'}}>
            <h3 className="font-weight-bold">Contact information</h3>
            <div className="forms-block d-flex justify-content-between mt-5 flex-wrap">
                <form className="col-5 col-lg-5 col-sm-5 col-12">
                    <div className="form-group">
                        <label htmlFor="inputNamePayment" value={name} onChange={(e)=>{setName(e.target.value)}}>first name *</label>
                        <input type="text" className="form-control" id="inputNamePayment"
                               aria-describedby="emailHelp" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastNamePayment" value={lastName} onChange={(e)=>{setLastName(e.target.value)}}>last name *</label>
                        <input type="text" className="form-control" id="lastNamePayment" />
                    </div>

                </form>

                <form className="col-5 col-lg-5 col-sm-5 col-12">
                    <div className="form-group">
                        <label htmlFor="inputCountryPay" value={country} onChange={(e)=>{setCountry(e.target.value)}}>country *</label>
                        <input type="text" className="form-control" id="inputCountryPay"
                               aria-describedby="emailHelp" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputStatePayment" value={state} onChange={(e)=>{setState(e.target.value)}}>state/province *</label>
                        <input type="text" className="form-control" id="inputStatePayment" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputCityPayment" value={city} onChange={(e)=>{setCity(e.target.value)}}>city *</label>
                        <input type="text" className="form-control" id="inputCityPayment" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputAddresspayment" value={address} onChange={(e)=>{setAddress(e.target.value)}}>street address *</label>
                        <input type="text" className="form-control" id="inputAddresspayment" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="postCodepayment" value={postCode} onChange={(e)=>{setpostCode(e.target.value)}}>zip/postal code *</label>
                        <input type="text" className="form-control" id="postCodepayment" />
                    </div>

                </form>
            </div>
            <button className="checkout-btn text-uppercase float-right">continue checkout</button>

            <style jsx>
                {
                    `
                                              
                        .checkout-btn{
                            border:none;
                            outline:none;
                            background-color:#7cb342;
                            color:#fff;
                            transition:all .4s ease;
                            padding: 15px 20px;
                            margin-right: 15px;
                        }
                        
                        .checkout-btn:hover{
                            background-color:#95d64c;
                        }
                        
                        
                        
                        
                        @media screen and (max-width: 450px){
                            .totalCost > p, h3{
                                font-size:1.5rem;
                            }
                            
                         
                        }
                        
                         @media screen and (max-width: 350px){
                            .totalCost > p{
                                font-size:1.2rem;
                            }
                        }
                  
                  `
                }
            </style>
        </div>
    )
}
