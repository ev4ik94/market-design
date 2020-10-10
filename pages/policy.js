import Head from 'next/head';
import React, {useState, useEffect, useContext, useCallback, useRef} from 'react';
import Link from 'next/link';
import {useRouter} from "next/router";
import MainLayout from '../components/MainLayout';

export default function Policy(){


    return(
        <MainLayout>
            <div className="container">

                <h1 className="text-center text-uppercase font-weight-bold">privacy policy</h1>

                <div className="bread-crumbs text-uppercase d-flex mt-3">
                    <p className="mb-0">you are here:</p>&nbsp;
                    <Link href="/">
                        <a title="home">home</a>
                    </Link>&nbsp;/&nbsp;
                    <p className="mb-0">privacy policy</p>
                </div>

                <div className="text-content">
                    <p className="">For limited liability company “PEEL PIC” (hereinafter – “PEEL PIC”) ensuring of rights’ and interests’ protection of the users is one of the most priority issues considering the peculiarities of the personal data processing provided by users when purchasing the licenses on usage of digital goods (pictures, images, graphic elements, etc.) and PEEL PIC services accomplished via the website: https://peelpic.com/ (hereinafter – the “Website”).</p>
                    <p>Provision of personal data and personal identifying information (commonly known as PII) is necessary for the user in order to use the Website and its services and access to PEEL PIC licenses on digital goods usage and services purchase. Non-provision of the respective PII by the user shall result in inability for PEEL PIC to provide digital goods and services to the user.</p>
                    <p>Within the present Policy under PII the information relating to an identified or identifiable user is understood, in particular: name, surname, e-mail address, address and country of residence, IP-address, etc.</p>
                    <p>PII do not include anonymous data that do not relate to an identified or are not identifiable in relation to concrete user as well as depersonalized data.</p>
                    <p><span style={{textDecoration:'underline'}}>Purpose of user’s PII processing:</span> provision of the user’s access to PEEL PIC`s licenses on digital goods usage and services purchase via the Website and its services.</p>
                    <p>PEEL PIC shall conduct processing of the following user’s PII:</p>
                    <p>- personal data: name, surname, e-mail address, address and country of residence, - requested for user’s account creation on the Website;</p>
                    <p>- authorization data (e-mail address and password);</p>
                    <p>- information about user’s activity on the Website (ID of the received digital good/service, date of receipt, time of receipt, amount of received goods/services, amount of the order, ID of the order (payment));</p>
                    <p>- statistics data related to the user’s account on the Website (amount of the digital goods/services received);</p>
                    <p>- information about computer, device or browser within the access to the Website that is processed by automated means, i.e. information about computer or mobile device, including IP-address, country of the entrance to the user’s account, operational system, type of the browser and cookies;</p>
                    <p>- agreement of the user to receive PEEL PIC`s newsletters and promotional materials.</p>
                    <p>PEEL PIC does not process the financial information about the transactions conducted by the user in connection with the purchases made (including the information about the banking card number, name of the cardholder, card’s validity term, etc.), such information is requested and processed by the payment’s processor and (or) the servicing bank.</p>
                </div>

                <style jsx>{
                    `
                    h1{
                        border-bottom:1px solid #f2ede8;
                        padding:10px 0px;
                    }
                    
                    .container {
                        min-height:400px;
                    }
                    
                    .bread-crumbs{letter-spacing:.07rem;}
                    
                    .bread-crumbs > a{
                        color: #263238;
                        text-decoration:none;
                    }
                    
                    .bread-crumbs > a:before{
                        content:attr(title);
                        display:block;
                        overflow:hidden;
                        visibility: hidden;
                        font-weight:bold;
                        height:0;
                        
                    }
                    
                    .bread-crumbs > a:hover{
                        font-weight:bold;
                    }
                `
                }</style>
            </div>
        </MainLayout>
    )
}
